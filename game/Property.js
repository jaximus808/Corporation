class Property 
{
    /**
   * Update service properties
   *
   * @param {string} name - name of property
   * @param {Int} cost - cost of property
   * @param {Int} houseCost - cost of buying a house
   * @param {Int} houseTax - inital tax for landing on property, the final tax will be houseTax 
   * @param {Int} multiplier - how much to multiply per house, ex 2 houses will be houseTax * multiplier*n
   * @param {Int} mortgage - mortgage
   * @param {Int} baseRent - base rent with no houses
   */
    constructor(name, cost, houseCost, houseTax, multiplier,mortgage,baseRent, state = 0 )
    {
        this.name = name; 
        this.cost = cost;
        this.houseCost = houseCost; 
        this.houseTax = houseTax; 
        this.multiplier = multiplier;
        this.mortgage = mortgage; 
        this.baseRent = baseRent; 
        this.owner = "not set"; 
        this.state = state;
        
        //0: purchasable, 1: owned
    }

    Act()
    {
        console.log("test")
    }

}

module.exports = Property;  