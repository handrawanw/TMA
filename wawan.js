

let _1Days=86400000;

let TradingViews={
    t:[
        1628002800000,
        1628175600000,
        1628348400000,
        1628521200000
    ],
    c:[
        100,
        20,
        40,
        60
      ]
};
let DateNows=new Date(1628002800000),Indexs=0;
DateNows.setHours(DateNows.getHours(),0,0,000);
for(let MsChart=Date.parse(DateNows);MsChart<Date.parse(DateNows)+Number(_1Days*7);MsChart+=_1Days){
    if(!TradingViews.t.includes(MsChart)){
        if(Indexs>0&&Indexs<TradingViews.t.length+2){
            TradingViews.t.splice(Indexs,0,MsChart);
            TradingViews.c.splice(Indexs,0,TradingViews.c[Indexs-1]);
        }else{
            TradingViews.t.splice(Indexs,0,MsChart);
            TradingViews.c.splice(Indexs,0,0);
        }
    }
    Indexs+=1;
}
console.log(TradingViews.t);
console.log(TradingViews.c);

