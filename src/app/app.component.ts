import { Component } from "@angular/core";
import * as io from "socket.io-client";

import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})

export class AppComponent {
  vote: number;
  pollObj: any = {question: "", options: []};

  socket: SocketIOClient.Socket;
  
  constructor() {
    this.socket = io.connect();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels: Label[] = [];
  public barChartData: SingleDataSet = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];


  colors: any[] = [{ 
    backgroundColor: [
      'silver',
      'lightsteelblue',
      'lightblue',
      'lightskyblue',
      'cornflowerblue',
      'steelblue',
      'darkblue',
      'rackley',
    ]
  }];

  ngOnInit() {
    this.listen2NewConnet();
    this.listen2NewVote();
  }
  listen2NewConnet(){
    this.socket.on("newClinet", data => {
      this.setLabel(data);
      this.setDate(data);
      this.pollObj = data;
    })
  }

  sendVote(){
    this.socket.emit("newVote",{vote:this.vote})
  }

  listen2NewVote(){
    this.socket.on("vote",data=>{
      this.setLabel(data);
      this.setDate(data);
      this.pollObj=data;
      console.log(this.pieChartData);
      console.log(this.pieChartLabels);
    })
  }

  setLabel(data){
    var arr = [];
    for(var num in data.options){
      arr.push(data.options[num].text)
    }
    this.pieChartLabels =  arr;
    this.barChartLabels =  arr;
    
  }
  
  setDate(data){
    var arr = [];
    for(var num in data.options){
      arr.push(data.options[num].count); 
  }

  this.pieChartData = arr;
  this.barChartData = arr;
  }

}