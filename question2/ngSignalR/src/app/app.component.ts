import { Component } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatButtonModule]
})
export class AppComponent {
  title = 'Pizza Hub';

  private hubConnection?: signalR.HubConnection;
  isConnected: boolean = false;

  selectedChoice: number = -1;
  nbUsers: number = 0;

  pizzaPrice: number = 0;
  money: number = 0;
  nbPizzas: number = 0;

  constructor(){
    this.connect();
  }

  connect() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5282/hubs/pizza')
      .build();

    // TODO: Mettre isConnected à true seulement une fois que la connection au Hub est faite
      this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
        console.log("Connected to hub successfully!");
      })
      .catch(err => console.log('Error while starting connection: ' + err))

    this.hubConnection.on("UpdateNbUsers", (nbUsers) => {
      this.nbUsers = nbUsers;
    });

    this.hubConnection.on("UpdatePizzaPrice", (pizzaPrice) => {
      this.pizzaPrice = pizzaPrice;
    });

    this.hubConnection.on("UpdateNbPizzasAndMoney", (nbPizza, money) => {
      this.nbPizzas = nbPizza;
      this.money = money;
    });

    this.hubConnection.on("UpdateMoney", (money) => {
      this.money = money;
    });

  }

  selectChoice(selectedChoice:number) {
    this.selectedChoice = selectedChoice;
    this.hubConnection?.invoke("SelectChoice", selectedChoice);
  }

  unselectChoice() {
    this.selectedChoice = -1;
    this.hubConnection?.invoke("UnselectChoice", this.selectedChoice);
  }

  addMoney() {
    this.hubConnection?.invoke("AddMoney", this.selectedChoice);
  }

  buyPizza() {
    this.hubConnection?.invoke("BuyPizza", this.selectedChoice);
  }
  
}
