using Microsoft.AspNetCore.SignalR;
using SignalR.Services;

namespace SignalR.Hubs
{
    /// <summary>
    /// SignalR hub responsible for managing real-time interactions between clients and the server.
    /// Handles user connections, group management, and pizza-related events.
    /// </summary>
    public class PizzaHub : Hub
    {
        private readonly PizzaManager _pizzaManager;

        public PizzaHub(PizzaManager pizzaManager)
        {
            _pizzaManager = pizzaManager;
        }

        /// <summary>
        /// Triggered automatically when a new client connects.
        /// Updates the global user count and broadcasts it to all clients.
        /// </summary>
        public override async Task OnConnectedAsync()
        {
            _pizzaManager.AddUser();
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);
            await base.OnConnectedAsync();
        }

        /// <summary>
        /// Triggered automatically when a client disconnects.
        /// Updates and broadcasts the new user count to all clients.
        /// </summary>
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _pizzaManager.RemoveUser();
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);
            await base.OnConnectedAsync();
        }

        /// <summary>
        /// Called when a client selects a pizza type.
        /// Adds the client to the corresponding SignalR group and sends back the current pizza price,
        /// number of pizzas, and total money for that selection.
        /// </summary>
        public async Task SelectChoice(PizzaChoice choice)
        {
            string groupName = _pizzaManager.GetGroupName(choice);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            int price = _pizzaManager.PIZZA_PRICES[(int)choice];
            int nbPizza = _pizzaManager.NbPizzas[(int)choice];
            int money = _pizzaManager.Money[(int)choice];

            await Clients.Caller.SendAsync("UpdatePizzaPrice", price);
            await Clients.Caller.SendAsync("UpdateNbPizzasAndMoney", nbPizza, money);
        }

        /// <summary>
        /// Called when a client unselects a pizza type and leaves its group.
        /// </summary>
        public async Task UnselectChoice(PizzaChoice choice)
        {
            string groupName = _pizzaManager.GetGroupName(choice);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        /// <summary>
        /// Increases the total money for the selected pizza group and updates all members of that group.
        /// </summary>
        public async Task AddMoney(PizzaChoice choice)
        {
            _pizzaManager.IncreaseMoney(choice);

            string groupName = _pizzaManager.GetGroupName(choice);
            int money = _pizzaManager.Money[(int)choice];

            await Clients.Group(groupName).SendAsync("UpdateMoney", money);
        }

        /// <summary>
        /// Attempts to buy a pizza (only succeeds if there is enough money in the group).
        /// Broadcasts updated pizza and money counts to the group.
        /// </summary>
        public async Task BuyPizza(PizzaChoice choice)
        {
            _pizzaManager.BuyPizza(choice);

            string groupName = _pizzaManager.GetGroupName(choice);
            int nbPizza = _pizzaManager.NbPizzas[(int)choice];
            int money = _pizzaManager.Money[(int)choice];

            await Clients.Group(groupName).SendAsync("UpdateNbPizzasAndMoney", nbPizza, money);
        }
    }
}
