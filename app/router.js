'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/circles/login', controller.login.login);     //用户登录
  router.post('/circles/question/already', controller.index.index);    //获取已经回答的问题
  router.get('/circles/question/get', controller.question.get);    //获取所有问题
  router.post('/circles/question/get/search', controller.question.getSearch);    //获取搜索问题
  router.get('/circles/question/type/get', controller.question.getType);    //获取问题分类
  router.get('/circles/interesting/type/get', controller.question.getInterestingType);    //获取用户兴趣分类统计
  router.get('/circles/interesting/user/get', controller.question.getInterestingUser);    //获取特定兴趣爱好的用户
  router.get('/circles/question/count/get', controller.question.getCount);    //获取问题统计
  router.get('/circles/question/user/get', controller.question.getLastMonth);    //获取最近一月问题
  router.post('/circles/user/interesting', controller.question.createInteresting);    //创建用户兴趣
  router.get('/circles/user/interesting/get', controller.question.getUserInteresting);    //获取用户兴趣
  router.post('/circles/question/relative/get', controller.question.getQuestionRelative);    //获取相关问题
  router.post('/circles/question/ask', controller.question.ask);     //用户提问问题
  router.get('/circles/question/details', controller.question.details);   //获取问题详情
  router.get('/circles/answer/get', controller.answer.get);         //获取问题的回答
  router.get('/circles/answer/hot/get', controller.answer.getHot);         //获取问题的回答
  router.post('/circles/answer/write', controller.answer.write);       //用户提交回答
  router.get('/circles/comment/root/get', controller.rootComment.get);   //获取用户评论
  router.post('/circles/comment/root/publish', controller.rootComment.publish);   //用户提交回答的评论
  router.post('/circles/comment/child/publish', controller.childComment.publish);  //用户对回答的评论进行评论
  router.post('/circles/follow/question', controller.follow.followQuestion);     //用户关注问题
  router.post('/circles/follow/user', controller.follow.followUser);     //用户关注
  router.post('/circles/user/get', controller.follow.userGet);     //用户信息
  router.post('/circles/message/create', controller.message.messageCreate);     //消息生成
  router.get('/circles/message/get', controller.message.messageGet);     //未读消息获取
  router.get('/circles/message/all/get/', controller.message.messageAllGet);     //消息获取
  router.get('/circles/message/all/user/get/', controller.message.messageAllUserGet);     //消息获取
  router.post('/circles/message/look', controller.message.messageLook);     //消息查看
  router.get('/circles/answer/invite', controller.answer.invite);    //邀请用户回答问题
  router.post('/circles/image/upload', controller.question.imageUpload);     //图片上传
 
};
