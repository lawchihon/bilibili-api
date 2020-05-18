require('cheerio');
const assert = require('assert');
const Bilibili = require('./index');
const jh = require('@johman/helper');

before('Confirm Bilibili is alive', function () {
  this.timeout(90000);
  return Bilibili.alive()
    .then(alive => {
      if (!alive) throw Error('Website not available');
    });
});

describe('bilibili', function() {
  describe('getFilters()', function() {
    this.timeout(90000);
    it('be able to get filters', function() {
      Bilibili.getFilters()
        .then(results => {
          assert(!!results);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getVideos()', function() {
    this.timeout(90000);
    it('before login is not adult', function(){
      return Bilibili.getVideos({keyword: '地獄廚房'})
        .then(videos => {
          // console.log(videos);
          assert(videos.length > 0);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getPlayUrl()', function() {
    this.timeout(90000);
    it('get play url by only bvid', function(){
      const bvid = 'BV17W411A7Wa';
      return Bilibili.getPlayUrl({bvid})
        .then(playUrl => {
          assert(!!playUrl);
        })
        .catch(jh.handleTestError);
    });
    it('get play url by bvid and cid', function(){
      const bvid = 'BV17W411A7Wa';
      const cid = '40856290';
      return Bilibili.getPlayUrl({bvid, cid})
        .then(playUrl => {
          assert(!!playUrl);
        })
        .catch(jh.handleTestError);
    });
    it('get play url by bvid and page', function(){
      const bvid = 'BV17W411A7Wa';
      const page = '2';
      return Bilibili.getPlayUrl({bvid, page})
        .then(playUrl => {
          assert(!!playUrl);
        })
        .catch(jh.handleTestError);
    });
    it('get play url by only aid', function(){
      const aid = '24392826';
      return Bilibili.getPlayUrl({aid})
        .then(playUrl => {
          assert(!!playUrl);
        })
        .catch(jh.handleTestError);
    });
    it('get play url by aid and cid', function(){
      const aid = '24392826';
      const cid = '40856290';
      return Bilibili.getPlayUrl({aid, cid})
        .then(playUrl => {
          assert(!!playUrl);
        })
        .catch(jh.handleTestError);
    });
    it('get play url by aid and page', function(){
      const aid = '24392826';
      const page = '2';
      return Bilibili.getPlayUrl({aid, page})
        .then(playUrl => {
          assert(!!playUrl);
        })
        .catch(jh.handleTestError);
    });
    it('get play url by id using bvid', function(){
      const id = 'BV17W411A7Wa';
      return Bilibili.getPlayUrl({id})
        .then(playUrl => {
          assert(!!playUrl);
        })
        .catch(jh.handleTestError);
    });
    it('get play url by id using bvid and cid', function(){
      const id = 'BV17W411A7Wa-40856290';
      return Bilibili.getPlayUrl({id})
        .then(playUrl => {
          assert(!!playUrl);
        })
        .catch(jh.handleTestError);
    });
    it('get play url by id using aid', function(){
      const id = '24392826';
      return Bilibili.getPlayUrl({id})
        .then(playUrl => {
          assert(!!playUrl);
        })
        .catch(jh.handleTestError);
    });
    it('get play url by id using aid and cid', function(){
      const id = '24392826-40856290';
      return Bilibili.getPlayUrl({id})
        .then(playUrl => {
          assert(!!playUrl);
        })
        .catch(jh.handleTestError);
    });
  });

  describe('getVideo()', function() {
    this.timeout(90000);
    it('get video by bvid', function(){
      const bvid = 'BV17W411A7Wa';
      return Bilibili.getVideo({bvid})
        .then(video => {
          assert(video.bvid, bvid);
          assert(video.pages.length === 237);
        })
        .catch(jh.handleTestError);
    });
    it('get video by bvid and cid', function(){
      const bvid = 'BV17W411A7Wa';
      const cid = '40856290';
      return Bilibili.getVideo({bvid, cid})
        .then(video => {
          assert(video.bvid, bvid);
          assert(video.cid, cid);
          assert(!!video.playUrl);
          assert(video.pages.length === 237);
        })
        .catch(jh.handleTestError);
    });
    it('get video by bvid and page', function(){
      const bvid = 'BV17W411A7Wa';
      const page = '2';
      return Bilibili.getVideo({bvid, page})
        .then(video => {
          assert(video.bvid, bvid);
          assert(!!video.cid);
          assert(!!video.playUrl);
          assert(video.pages.length === 237);
        })
        .catch(jh.handleTestError);
    });
    it('get video by aid', function(){
      const aid = '24392826';
      return Bilibili.getVideo({aid})
        .then(video => {
          assert(video.aid, aid);
          assert(video.pages.length === 237);
        })
        .catch(jh.handleTestError);
    });
    it('get video by aid and cid', function(){
      const aid = '24392826';
      const cid = '40856290';
      return Bilibili.getVideo({aid, cid})
        .then(video => {
          assert(video.aid, aid);
          assert(video.cid, cid);
          assert(!!video.playUrl);
          assert(video.pages.length === 237);
        })
        .catch(jh.handleTestError);
    });
    it('get video by aid and page', function(){
      const aid = '24392826';
      const page = '2';
      return Bilibili.getVideo({aid, page})
        .then(video => {
          assert(video.aid, aid);
          assert(!!video.cid);
          assert(!!video.playUrl);
          assert(video.pages.length === 237);
        })
        .catch(jh.handleTestError);
    });
    it('get video by id using bvid', function(){
      const id = 'BV17W411A7Wa';
      return Bilibili.getVideo({id})
        .then(video => {
          assert(video.id, id);
          assert(video.bvid, id);
          assert(video.pages.length === 237);
        })
        .catch(jh.handleTestError);
    });
    it('get video by id using aid', function(){
      const id = '24392826';
      return Bilibili.getVideo({id})
        .then(video => {
          assert(video.id, id);
          assert(video.aid, id);
          assert(video.pages.length === 237);
        })
        .catch(jh.handleTestError);
    });
    it('get video by id using bvid and cid', function(){
      const id = 'BV17W411A7Wa-40856290';
      return Bilibili.getVideo({id})
        .then(video => {
          assert(video.id, id);
          assert(!!video.playUrl);
          assert(video.pages.length === 237);
        })
        .catch(jh.handleTestError);
    });
    it('get video by id using aid and cid', function(){
      const id = '24392826-40856290';
      return Bilibili.getVideo({id})
        .then(video => {
          assert(video.id, id);
          assert(!!video.playUrl);
          assert(video.pages.length === 237);
        })
        .catch(jh.handleTestError);
    });
  });
});
