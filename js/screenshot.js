class drawPanel{
    constructor(){
        this.temp = false   //可以画画吗 
        this.startX = null  //起始点x
        this.startY = null  //起始点y
        this.originX = null //终点x
        this.originY = null //终点y
        this.textflag = true//文字输入标杆   
    }

}


class Plot extends drawPanel{
    constructor(){
        this.angel = ""
        this.beginPoint = {}
        this.stopPoint = {}
        this.polygonVertex = []
        this.BaseDate = {
            edgeLen: 50,
            angle: 25
        }
    }
    dynArrowSize(){
        let x1 = this.stopPoint.x - this.beginPoint.x,
            y1 = this.stopPoint.y - this.beginPoint.y
            length = Math.sqrt(Math.pow(x1, 2)) +Math.pow(y1, 2);
        if (length < 250) {
                this.BaseDate.edgeLen = this.BaseDate.edgeLen / 2;
                this.BaseDate.angle = this.BaseDate.angle / 2;
            } else if (length < 500) {
                this.BaseDate.edgeLen = this.BaseDate.edgeLen * length / 500;
                this.BaseDate.angle = this.BaseDate.angle * length / 500;
        }
    }

    getRadian(beginPoint,stopPoint){
        this.angle = Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) / Math.PI * 180;
        paraDef(50, 25);
        this.dynArrowSize();
    }
}