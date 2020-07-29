const _ = require('lodash');
const cheerio = require('cheerio');
const jh = require('@johman/helper');
const axios = require('axios');

const c = require('./constants.js');
const userAgent = 'Mozilla: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.3 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/43.4';

const bilibiliInstance = axios.create({
  baseURL: c.BASE_URL,
  headers: {
    origin: c.BASE_URL,
    referer: c.BASE_URL,
    'upgrade-insecure-requests': 1,
    'user-agent': userAgent
  }
});

const bilibiliApiInstance = axios.create({
  baseURL: c.API_BASE_URL,
  headers: {
    origin: c.API_BASE_URL,
    referer: c.API_BASE_URL,
    'upgrade-insecure-requests': 1,
    'user-agent': userAgent
  }
});

const bilibiliSearchInstance = axios.create({
  baseURL: c.SEARCH_BASE_URL,
  headers: {
    origin: c.SEARCH_BASE_URL,
    referer: c.SEARCH_BASE_URL,
    'upgrade-insecure-requests': 1,
    'user-agent': userAgent
  }
});

/**
 * Parse the custom id for each video
 * Combination of the id:
 * - ${bvid}
 * - ${aid}
 * - ${bvid}-${cid}
 * - ${aid}-${cid}
 * @param id
 * @returns {{}}
 */
const parseId = (id) => {
  if (!id) return {};
  const idInfo = {};
  const [vid, cid] = id.split('-');
  if (cid) {
    idInfo.cid = cid;
  }
  if (vid.startsWith('BV')) {
    idInfo.bvid = vid;
  } else {
    idInfo.aid = vid;
  }
  return idInfo;
};

/**
 * Get the video data base on id/aid/bvid
 * @param id
 * @param aid
 * @param bvid
 * @param instance
 * @returns {Promise<Object>}
 */
const getVideoData = ({id, aid, bvid, instance}) => {
  let parsedId = parseId(id);
  bvid = parsedId.bvid || bvid;
  aid = parsedId.aid || aid;

  const options = {
    method: 'GET',
    url: `${c.BASE_URL}/video/${bvid || `av${aid}`}`,
  };
  return (instance || bilibiliInstance)(options)
    .then(response => {
      const initialState = JSON.parse(response.data.extractBetween('window.__INITIAL_STATE__=', ';(func'));
      return _.assign(initialState.videoData, {tags: initialState.tags});
    });
  // Note: the following is using the view api, but it doesnt have tags info
  // const options = {
  //   method: 'GET',
  //   url: `${c.API_BASE_URL}/x/web-interface/view`,
  //   params: { bvid },
  // };
  // return (instance || bilibiliApiInstance)(options)
  //   .then(response => response.data.data);
};

class Bilibili {
  static get INSTANCE() {
    return bilibiliInstance;
  }

  static get API_INSTANCE() {
    return bilibiliApiInstance;
  }

  static get SEARCH_INSTANCE() {
    return bilibiliSearchInstance;
  }

  static get CONSTANTS() {
    return c;
  }

  /**
   * Check if bilibili.com is accessible
   * @returns {Promise<boolean>}
   */
  static alive() {
    const {instance = bilibiliInstance} = jh.convertToByReference(arguments, ['instance']);
    const options = {
      method: 'HEAD',
      url: c.BASE_URL,
    };
    return instance(options)
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  /**
   * Get the filters that is using on bilibili.com
   * @returns {Promise<{}>}
   */
  static getFilters() {
    const {instance = bilibiliSearchInstance} = jh.convertToByReference(arguments, ['instance']);
    const options = {
      method: 'GET',
      url: c.SEARCH_BASE_URL,
    };

    return instance(options)
      .then(response => {
        const $ = cheerio.load(response.data);
        let searchScript;
        $('script').each((i, elem) => {
          const src = elem.attribs.src;
          if (!src || !src.includes('search/search')) return;
          searchScript = src.replace(/^\/\//g, 'https://');
        });
        if (!searchScript) return;
        return instance({
          method: 'GET',
          url: searchScript
        })
          .then((response) => {
            const searchData = JSON.parse(response.data.extractBetween('t.exports=JSON.parse(\'', '\''));
            const filters = {};
            _.forEach(searchData.config.menus, (menu, menuKey) => {
              filters[menuKey] = _.map(menu, (name, value) => {
                return {name, value};
              });
            });
            return filters;
          });
      });
  }

  /**
   * Search for videos on bilibili.com
   * @returns {Promise<Array>}
   */
  static getVideos() {
    const {order, page = 1, keyword, duration, typeId, instance = bilibiliApiInstance} = jh.convertToByReference(arguments, ['order', 'page', 'keyword', 'duration', 'typeId', 'instance']);
    if (!keyword) return Promise.resolve([]);
    const options = {
      method: 'GET',
      url: `${c.API_BASE_URL}/x/web-interface/search/type`,
      params: {
        page: page,
        order: order,
        keyword: keyword,
        duration: duration,
        search_type: 'video',
        tid: typeId,
        single_column: 0,
        jsonp: 0
      }
    };

    return instance(options)
      .then((response) => {
        return _.map(_.get(response, 'data.data.result', []), result => {
          return {
            id: result.bvid || result.aid,
            aid: result.aid,
            bvid: result.bvid,
            title: result.title.replace(/<em class="keyword">|<\/em>/g, ''),
            author: result.author,
            mid: result.mid,
            description: result.description,
            duration: result.duration,
            typeId: result.typeid,
            type: result.typename,
            publishDate: result.pubdate,
            picture: result.pic.replace(/^\/\//g, 'https://'),
            tags: result.tag.split(','),
            plays: result.play,
            reviews: result.review,
            favorites: result.favorites
          }
        });
      });
  };

  /**
   * Get the url to the flash video
   * @returns {Promise<String>}
   */
  static getPlayUrl() {
    let {id, bvid, cid, aid, page = 1, instance = bilibiliApiInstance} = jh.convertToByReference(arguments, ['id', 'bvid', 'cid', 'aid', 'instance']);
    const parsedId = parseId(id);
    bvid = parsedId.bvid || bvid;
    cid = parsedId.cid || cid;

    if (!bvid || !cid) {
      return Bilibili.getVideo({id, bvid, cid, aid, page, instance})
        .then((videoInfo) => videoInfo.playUrl);
    }
    return instance({
      method: 'GET',
      url: `${c.API_BASE_URL}/x/player/playurl`,
      params: {
        bvid, cid
      }
    })
      .then(response => {
        return _.get(response, 'data.data.durl.0.url');
      });
  }

  /**
   * Get the video info base on id/bvid/aid
   * @returns {Promise<Object>}
   */
  static getVideo() {
    let {id, bvid, cid, aid, page, instance} = jh.convertToByReference(arguments, ['id', 'bvid', 'cid', 'aid', 'instance']);
    const parsedId = parseId(id);
    cid = parsedId.cid || cid;

    return getVideoData({id, bvid, aid, instance})
      .then(async (videoData) => {
        const video = {
          id: id,
          aid: videoData.aid,
          bvid: videoData.bvid,
          title: videoData.title,
          type: videoData.tname,
          author: videoData.owner.name,
          mid: videoData.owner.mid,
          description: videoData.desc,
          picture: videoData.pic,
          publishDate: videoData.pubdate,
          tags: videoData.tags ? _.map(videoData.tags, 'tag_name') : videoData.dynamic.replace(/^#/g, '').split('##'),
          views: videoData.stat.view,
          reviews: videoData.stat.reply,
          favorites: videoData.stat.favorite
        };

        video.pages = _.map(videoData.pages, (page) => {
          return {
            id: `${video.bvid || video.aid}-${page.cid}`,
            cid: `${page.cid}`,
            bvid: video.bvid,
            title: page.part || videoData.title,
            duration: page.duration,
          }
        });

        const matchPage = (cid) ? _.find(video.pages, {cid}) : (page > 0) ? video.pages[page-1] : null;
        if (matchPage) {
          video.title = matchPage.title;
          video.cid = matchPage.cid;
          try {
            video.playUrl = await Bilibili.getPlayUrl({id, bvid: video.bvid, cid: video.cid, instance});
          } catch(err) {
            console.warn('Failed to get play url');
          }
        }
        return video;
      });
  }
}

module.exports = Bilibili;
