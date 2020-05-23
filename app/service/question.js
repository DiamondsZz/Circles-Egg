'use strict';

const Service = require('egg').Service;

const CheerIO = require("cheerio")

const Request = require("request");
const Moment = require("moment")
class QuestionService extends Service {


  //获取问题详情
  async  getQuestionDetails(questionId, userId) {


    //查询是否有点击统计
    let isClick = await this.ctx.model.Click.findOne({ user: userId, questionId });
    if (!!isClick) {
      await this.ctx.model.Click.update({ '_id': isClick._id }, { $inc: { 'count': 1 } })
    } else {
      await this.ctx.model.Click.create({ user: userId, questionId });
    }





    //获取问题详情
    let resDetails
      = await this.ctx.model.Question.findOne({ _id: questionId }).populate("user").exec();
    let res = JSON.parse(JSON.stringify(resDetails));
    //查询是否有关注
    let isFollow = await this.ctx.model.Follow.findOne({ question: questionId, user: userId });
    if (!!isFollow) {
      res.isFollow = isFollow.isFollow;
    } else {
      res.isFollow = false
    }
    //查询关注人数
    let followPerson = await this.ctx.model.Follow.find({ question: questionId, isFollow: true });
    res.follower = followPerson.length;
    return res;
  }
  //用户提交问题
  async askQuestions(question) {
    let res = await this.ctx.model.Question.create(question);
    return res;
  }

  //获取已回答问题数据
  async getQuestionsAlready(type, user) {
    let resQues = [];  //问题数据
    let followedUser; //被关注用户

    //根据type(用户兴趣偏好)进行推荐
    function sortByType(type, ques) {
      let resFilter = [];
      for (let item of ques) {
        for (let quesType of type) {
          if (item.type.indexOf(quesType) !== -1) {
            resFilter.push(item);
            break;
          };
        }
      }
      return resFilter;
      // return resFilter.length > 20 ? resFilter.slice(0, 20) : resFilter;
    }



    //关注页面
    if (!type && user) {
      let time = Moment().format("YYYY-MM-DD");//当前时间
      let timeAWeekAgo = Moment().subtract(1, 'months').format("YYYY-MM-DD")//一月前
      //获取该用户关注的用户
      followedUser = await this.ctx.model.FollowUser.find({ fromUser: user, isFollow: true })
      if (followedUser.length > 0) {
        let resSorted = [];
        let resSortedQuestions = await this.ctx.model.Question.find({ $and: [{ createdTime: { $gte: timeAWeekAgo } }, { createdTime: { $lte: time } }] }).populate("user").exec();
        let resSortedMessages = await this.ctx.model.Message.find({ $and: [{ type: { $ne: 0 } }, { type: { $ne: 4 } }, { createdTime: { $gte: timeAWeekAgo } }, { createdTime: { $lte: time } }] }).populate("user").populate("question").exec();
        resSorted = [...resSortedQuestions, ...resSortedMessages]
        for (let r of resSorted) {
          let isFollow = followedUser.some((u) => {
            return r.user._id.toHexString() === u.user.toHexString()
          })
          if (isFollow) {
            resQues.push(r)
          }
        }
        //按时间排序
        resQues.sort((a, b) => {
          return b.createdTime - a.createdTime
        })


      } else {
        resQues = []
      }
    } else {
      resQues = await this.ctx.model.Question.find().populate("user").exec();
    }




    //判断问题数据是否为空
    if (resQues.length > 0) {
      let res = [];   //回答为空的问题
      //对问题数据添加回答
      let resAll = await Promise.all(resQues.map(async (ques) => {
        let answer = await this.ctx.model.Answer.find({ questionId: ques._id }).populate("user").exec();
        let question = JSON.parse(JSON.stringify(ques));
        question.answer = answer;
        return question;
      }))
      //推荐问题
      if (type && user) {
        //过滤回答为空的问题
        res = resAll.filter((item) => {
          return item.answer.length > 0;
        })
        //获取该用户点击统计的问题
        let clickCountQues = await this.ctx.model.Click.find({ user }).sort({ 'count': 1 }).limit(6).populate("questionId").exec();
        if (clickCountQues.length > 0) {
          let types = new Set();
          for (let click of clickCountQues) {
            //判断是否有问题分类
            if (click.questionId.type && click.questionId.type.length > 0) {
              for (let type of click.questionId.type) {
                types.add(type)
              }
            }
          }
          return sortByType([...types], res);
        } else {
          return sortByType(type, res);
        }

      } else {
        return resAll
      }
    } else {
      return []
    }





  }
  //获取问题数据
  async getQuestions(quesType) {
    let res;
    if (quesType) {
      let resQues = await this.ctx.model.Question.find({ type: { $elemMatch: { $eq: quesType } } }).limit(6)
      let resAll = await Promise.all(resQues.map(async (ques) => {
        let answer = await this.ctx.model.Answer.find({ questionId: ques._id }).populate("user").exec();
        let question = JSON.parse(JSON.stringify(ques));
        question.answer = answer;
        return question;
      }))
      res = resAll.sort((a, b) => {
        return b.answer.length - a.answer.length
      })
    } else {
      res = await this.ctx.model.Question.aggregate([
        {
          $lookup: {
            from: 'answer',
            localField: '_id',
            foreignField: 'questionId',
            as: 'question_answer'
          }
        },
      ])
    }

    return res
  }
  //获取问题数据
  async getCount() {
    let res = await this.ctx.model.Question.find();
    let quesTypes = [];
    let types = await this.ctx.model.QuestionType.find();
    let map = new Map();
    //获取所有问题的分类
    for (let ques of res) {
      quesTypes = [...quesTypes, ...ques.type]
    }
    //问题分类Map初始化
    for (let type of types) {
      map.set(type.type, 0);
    }
    //问题分类统计
    for (let t of quesTypes) {
      let count = map.get(t)
      map.set(t, count + 1)
    }


    return {
      type: [...map.keys()],
      count: [...map.values()]
    }
  }
  //获取搜索问题
  async getQuestionsSearch(search) {
    let res = await this.ctx.model.Question.find({ til: new RegExp(`${search}`) })
    return res
  }
  //获取问题分类
  async getType(des) {
    let res = await this.ctx.model.QuestionType.find({ type: new RegExp(des, "i") })
    let resType = res.map((item) => {
      return item.type
    })
    return resType
  }
  //创建用户兴趣
  async createInteresting(arg) {
    let res = await this.ctx.model.Interesting.create(arg)
    return res
  }
  //获取用户兴趣
  async getUserInteresting(user) {
    let res = await this.ctx.model.Interesting.find({ user })
    return res
  }
  //获取用户兴趣分类
  async getInterestingType(user) {
    let res = await this.ctx.model.Interesting.find();
    let interestingTypes = [];
    let types = await this.ctx.model.QuestionType.find();
    let map = new Map();
    for (let i of res) {
      interestingTypes = [...interestingTypes, ...i.type]
    }
    //问题分类Map初始化
    for (let type of types) {
      map.set(type.type, 0);
    }
    //问题分类统计
    for (let t of interestingTypes) {
      let count = map.get(t)
      map.set(t, count + 1)
    }

    return {
      type: [...map.keys()],
      count: [...map.values()]
    }
    return res
  }
  //获取特定兴趣爱好用户
  async getInterestingUser(name, fromUser) {
    let res = await this.ctx.model.Interesting.find({ type: { $elemMatch: { $eq: name } } }).populate("user").exec();
    if (res.length > 0) {
      let resCopy = JSON.parse(JSON.stringify(res));
      for (let r of resCopy) {
        let isFollow = await this.ctx.model.FollowUser.findOne({ user: r.user._id, fromUser });
        if (!!isFollow) {
          r.isFollow = isFollow.isFollow
        } else {
          r.isFollow = false
        }
      }
      return resCopy
    } else {
      return []
    }


  }
  //获取相关问题
  async getQuestionRelative(type, id) {
    const ObjectId = this.app.mongoose.Types.ObjectId;
    if (type) {
      let res = await this.ctx.model.Question.aggregate([
        {
          $lookup: {
            from: 'answer',
            localField: '_id',
            foreignField: 'questionId',
            as: 'question_answer'
          },
        }, {
          $match: { _id: { $ne: ObjectId(id) } }
        }
      ])
      let resFilter = [];
      for (let item of res) {
        if (item.type) {
          for (let quesType of type) {
            if (item.type.indexOf(quesType) !== -1) {
              resFilter.push(item);
              break;
            };
          }
        }
      }
      return resFilter.slice(0, 4);
    } else {
      return []
    }
  }
  //获取最近一月问题
  async getLastMonth(user) {
    let time = Moment().add(1, "days").format("YYYY-MM-DD");//当前时间
    let timeAWeekAgo = Moment().subtract(1, 'months').format("YYYY-MM-DD")//一月前

    //获取用户爱好
    let interesting = await this.ctx.model.Interesting.findOne({ user });
    let types = interesting ? interesting.type : null;
    let map = new Map();
    if (types) {
      for (let type of types) {
        map.set(type, 0)
      }
      for (let type of types) {
        let questions = await this.ctx.model.Question.find({ type: { $elemMatch: { $eq: type } }, $and: [{ createdTime: { $gte: timeAWeekAgo } }, { createdTime: { $lte: time } }] });

        console.log(questions);
        console.log(timeAWeekAgo);
        console.log(time);
        
        //对问题添加回答
        let quesHasAnswers = await Promise.all(questions.map(async (ques) => {
          let answer = await this.ctx.model.Answer.find({ questionId: ques._id }).populate("user").exec();
          let question = JSON.parse(JSON.stringify(ques));
          question.answer = answer;
          return question;
        }))
        for (let q of quesHasAnswers) {
          let count = map.get(type)
          map.set(type, count + q.answer.length);
        }


      }
    }

    return {
      interesting: [...map.keys()],
      count: [...map.values()]
    }
  }
  //
  async getHot() {
    let body
    // body = await new Promise((resolve, reject) => {
    //   Request("https://www.zhihu.com/hot", (err, response, body) => {
    //   console.log(body);



    //   })
    // })


    return []
  }

}

module.exports = QuestionService;
