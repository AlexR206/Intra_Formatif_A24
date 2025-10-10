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

  // 🔗 Connects to the SignalR hub on the backend
  connect() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5282/hubs/pizza')
      .build();

    // Start the connection
    this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
        console.log("Connected to hub successfully!");
      })
      .catch(err => console.log('Error while starting connection: ' + err))

    // === Server-to-client event handlers ===

    // Updates the number of connected users (sent by OnConnectedAsync / OnDisconnectedAsync)
    this.hubConnection.on("UpdateNbUsers", (nbUsers) => {
      this.nbUsers = nbUsers;
    });

    // Updates the price of the currently selected pizza
    this.hubConnection.on("UpdatePizzaPrice", (pizzaPrice) => {
      this.pizzaPrice = pizzaPrice;
    });

    // Updates both number of pizzas bought and total money for the group
    this.hubConnection.on("UpdateNbPizzasAndMoney", (nbPizza, money) => {
      this.nbPizzas = nbPizza;
      this.money = money;
    });

    // Updates only the money (used when someone clicks “Add Money”)
    this.hubConnection.on("UpdateMoney", (money) => {
      this.money = money;
    });
  }

  // === Client-to-server invocations ===

  // Called when the user selects a pizza type
  selectChoice(selectedChoice:number) {
    this.selectedChoice = selectedChoice;
    this.hubConnection?.invoke("SelectChoice", selectedChoice);
  }

  // Called when the user unselects their pizza type
  unselectChoice() {
    this.hubConnection?.invoke("UnselectChoice", this.selectedChoice);
    this.selectedChoice = -1;
  }

  // Adds money (2$) to the selected pizza group
  addMoney() {
    this.hubConnection?.invoke("AddMoney", this.selectedChoice);
  }

  // Attempts to buy a pizza if enough group money accumulated
  buyPizza() {
    this.hubConnection?.invoke("BuyPizza", this.selectedChoice);
  }
}
