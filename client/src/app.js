require("../static/css/app.css");
const avalon = require("avalon2");
const $ =require('jquery');

window.avalonRoot=avalon.define({
    $id: "app",
    user:{
        userid:"",
        status:"viewer",
        userData:{
            username:"游客",
            userImage:"",
        }
    },
    msgData:{
        color:"#333333",
        message:""
    },
    dialog:{
        username:""
    },
    userList:{
        kp:null,
        pcs:[],
        viewers:[]
    },
    messageList:[
    ],
    noteList:[],
    ws:"",
    roll:{
        time:"1",
        num:"100",
        stime:"1",
        snum:"100"
    },
    init:function(){
        let self=this;
        window.ws = io('http://localhost:10080');
        // window.ws = io('http://'+window.location.host+':10080');
        ws.on('connect', ()=>{
        });
        ws.on('init', (res)=>{
            self.user.userid=res.userid;
            self.joinRoom();
        });
        ws.on('freshUser', (res)=>{
            self.user=res.data;
        });
        ws.on('message',(res)=>{
            self.getMessage(res)
        });
        ws.on('userUpdate',(res)=>{
            self.user=res;
        });
        ws.on('messageList',(res)=>{
           self.messageList=res.data;
            $(".messageList").animate({scrollTop:$(".messageList").prop("scrollHeight")}, 200);
        });
        ws.on('userList',(res)=>{
           let list=res.data;
           let pcs=[];
           let viewers=[];
           let kp=null;
           for(let i=0;i<list.length;i++){
               if(list[i].status=='kp'){
                    kp=list[i]
               }else if(list[i].status=='pc'){
                   pcs.push(list[i])
               }else{
                   viewers.push(list[i])
               }
           }
           self.userList.kp=kp;
           self.userList.pcs=pcs;
           self.userList.viewers=viewers;
        });
        self.getUserList();
        self.getMessageList();
        self.resizeWindow();
        $(window).resize(self.resizeWindow);

        window.onpagehide=function(){alert(1)}
    },
    resizeWindow:function(){
        let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
        let htmlDom = document.getElementsByTagName('html')[0];
        htmlDom.style.fontSize = htmlWidth / 24 + 'px';
    },
    joinRoom:function(){
        let self=this;
        ws.emit('join',self.user);
    },
    joinGame:function(){
        let self=this;
        var params={
            user:self.user,
            questType:"joinGame",
        }
        ws.emit('newQuest',self.user);
    },
    sendMessage:function(){
        let self=this;
        if(self.msgData.message==""){
            return false;
        }
        let param={
            userid:self.user.userid,
            username:self.user.userData.username,
            message:self.msgData.message
        }

        ws.emit('message',param);
        setTimeout(function(){
            self.msgData.message="";
        },50);
        return false;
    },
    getMessage:function(data){
        this.messageList.push(data);
        $(".messageList").animate({scrollTop:$(".messageList").prop("scrollHeight")}, 200);
    },
    getUserList:function(){
        ws.emit('userList',{});
    },
    getMessageList:function(){
        ws.emit('messageList',{});

    },
    rd:function(num,sec){
        let self=this;
        let param={
            time:1,
            userid:self.user.userid,
            username:self.user.userData.username,
            num:num,
            sec:sec
        }
        ws.emit('roll',param);
    },
    mrd:function(e,sec){
        let target=e.target;
        if(target.nodeName=="INPUT"){
            return;
        }
        let self=this;
        let time,num;
        if(sec==1){
            time=self.roll.stime;
            num=self.roll.snum;
        }else{
            time=self.roll.time;
            num=self.roll.num;
        }
        let param={
            time:time,
            userid:self.user.userid,
            username:self.user.userData.username,
            num:num,
            sec:sec
        }
        ws.emit('roll',param);
    },
    rename:function(){

        let self=this;
        if(self.dialog.username==""){
            return ;
        }
        let param={
            userid:self.user.userid,
            username:self.dialog.username
        }
        ws.emit('rename',param);
        self.hideDialog();
    },
    showUserMenu:function(){
        let self=this;
        $('.user-menu').slideDown();
        $('body').on('click',self.hideUserMenu)
    },
    hideUserMenu:function(){
        $('.user-menu').slideUp();
        $('body').off('click')
    },
    showDialog:function(){
        this.hideUserMenu();
        $('.modal').show();
        $('.dialog').show();
        this.dialog.username=this.user.userData.username;
        $('#dialog-username').focus().select();
    },
    hideDialog:function(){
        $('.modal').hide();
        $('.dialog').hide();
    },
    selectIpt:function(e){
        let target=e.target;
        $(target).select();
    }
})
avalonRoot.$watch('onReady',function(){
    let self=this;
    console.log(self.user)
    setTimeout(function(){
        self.init();
    },500)
})