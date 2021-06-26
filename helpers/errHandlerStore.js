const StoresErrHandler={

    "jwt must be provided":"jwt harus disertakan",
    "jwt expired":"sesi token telah berakhir"

};

function SearchKeyword(keyword){
    if(StoresErrHandler.hasOwnProperty(keyword)){
        return StoresErrHandler[keyword];
    }
    return keyword;
}

module.exports={
    SearchKeyword
};