using Microsoft.AspNetCore.SignalR;
using SignalR.Services;

namespace SignalR.Hubs
{
    // The PizzaHub class acts as the communication hub between the server and all connected clients.
    // Clients use this hub to send and receive messages in real-time.
    public class PizzaHub : Hub
    {
        // Reference to the PizzaManager, which stores and manages all shared data (money, pizzas, users)
        private readonly PizzaManager _pizzaManager;

        // Constructor that receives the PizzaManager through dependency injection
        public PizzaHub(PizzaManager pizzaManager)
        {
            _pizzaManager = pizzaManager;
        }

        // This method is automatically called whenever a new client connects to the hub
        public override async Task OnConnectedAsync()
        {
            // Increase the number of connected users
            _pizzaManager.AddUser();

            // Notify all clients about the new number of connected users
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);

            // Call the base implementation (important for proper connection handling)
            await base.OnConnectedAsync();
        }

        // This method is automatically called whenever a client disconnects from the hub
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Decrease the number of connected users
            _pizzaManager.RemoveUser();

            // Notify all clients about the updated number of connected users
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);

            // Call the base method to ensure proper cleanup
            await base.OnConnectedAsync();
        }

        // This method is called when a user selects a pizza choice (with or without pineapple)
        public async Task SelectChoice(PizzaChoice choice)
        {
            // Get the name of the group associated with the selected pizza choice
            string groupName = _pizzaManager.GetGroupName(choice);

            // Add the current user (connection) to the corresponding pizza group
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            // Get the price of the selected pizza from the PizzaManager
            int pizzaPrice = _pizzaManager.PIZZA_PRICES[(int)choice];

            // Send the pizza price to the client who just selected it (only to the caller)
            await Clients.Caller.SendAsync("UpdatePizzaPrice", pizzaPrice);

            // Get the number of pizzas and total money for the selected pizza type
            int nbPizza = _pizzaManager.NbPizzas[(int)choice];
            int money = _pizzaManager.Money[(int)choice];

            // Send the number of pizzas and money back to the client who selected this pizza
            await Clients.Caller.SendAsync("UpdateNbPizzasAndMoney", nbPizza, money);
        }

        // This method is called when a user unselects a pizza choice
        public async Task UnselectChoice(PizzaChoice choice)
        {
            // Get the name of the group that the user is leaving
            string groupName = _pizzaManager.GetGroupName(choice);

            // Remove the user (connection) from that group
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        // This method is called when a user clicks "Add Money" for a pizza group
        public async Task AddMoney(PizzaChoice choice)
        {
            // Increase the total money for the selected pizza group
            _pizzaManager.IncreaseMoney(choice);

            // Get the group name corresponding to that pizza choice
            string groupName = _pizzaManager.GetGroupName(choice);

            // Get the updated money amount for that pizza type
            int money = _pizzaManager.Money[(int)choice];

            // Notify everyone in the same pizza group about the new total money
            await Clients.Group(groupName).SendAsync("UpdateMoney", money);
        }

        // This method is called when a user clicks "Buy Pizza"
        public async Task BuyPizza(PizzaChoice choice)
        {
            // Try to buy a pizza (only works if enough money is available)
            _pizzaManager.BuyPizza(choice);

            // Get the name of the group for this pizza choice
            string groupName = _pizzaManager.GetGroupName(choice);

            // Get the updated number of pizzas and remaining money for this group
            int nbPizza = _pizzaManager.NbPizzas[(int)choice];
            int money = _pizzaManager.Money[(int)choice];

            // Notify everyone in the same group of the updated pizza count and money
            await Clients.Group(groupName).SendAsync("UpdateNbPizzasAndMoney", nbPizza, money);
        }
    }
}
