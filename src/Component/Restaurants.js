import React, { useState, useEffect } from 'react';

const Restaurants = ({ token }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuModalOpen, setMenuModalOpen] = useState(false);
    const [restaurantMenu, setRestaurantMenu] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:8080/restaurant/showActiveOrInactiveRestaurant/true', {
                    headers: {
                        'Authorization': `${token}`
                    }
                });

                if (response.headers.get('Content-Type').includes('application/json')) {
                    const data = await response.json();
                    setRestaurants(data);
                    setFilteredRestaurants(data);
                } else {
                    console.error('Error: Unexpected content type');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchRestaurants();
    }, [token]);

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const filtered = restaurants.filter((restaurant) =>
            restaurant.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRestaurants(filtered);
    };

    const handleRestaurantClick = async (restaurantId) => {
        try {
            const response = await fetch(`http://localhost:8080/restaurant/getRestaurantMenu/${restaurantId}`, {
                headers: {
                    'Authorization': `${token}`
                }
            });

            if (response.headers.get('Content-Type').includes('application/json')) {
                const data = await response.json();
                setRestaurantMenu(data);
                setMenuModalOpen(true);
            } else {
                console.error('Error: Unexpected content type');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addToCart = (item) => {
        setCartItems([...cartItems, item]);
    };

    const closeModal = () => {
        setMenuModalOpen(false);
    };

    return (
        <div className="App">
            <div>
                <button onClick={toggleSearch}>Поиск</button>
                {searchVisible && (
                    <input
                        type="text"
                        placeholder="Search restaurant"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                )}
            </div>
            <div>
                <button>Update info</button>
                <button>See history of orders</button>
            </div>
            <div>
                {filteredRestaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        style={{ border: '1px solid black', padding: '1em', marginBottom: '1em', cursor: 'pointer' }}
                        onClick={() => handleRestaurantClick
                        (restaurant.id)}
                    >
                        <h3>{restaurant.restaurantName}</h3>
                        <p>{restaurant.cuisine}</p>
                        <p>
                            {restaurant.address.street}, {restaurant.address.city}
                        </p>
                    </div>
                ))}
            </div>
            {menuModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '2em',
                            borderRadius: '10px',
                            maxWidth: '80%',
                            maxHeight: '80%',
                            overflowY: 'scroll',
                        }}
                    >
                        {restaurantMenu.map((item) => (
                            <div key={item.id} style={{ marginBottom: '1em' }}>
                                <h3>{item.foodName}</h3>
                                <p>{item.foodDescription}</p>
                                <p>Price: ${item.foodPrice}</p>
                                <button onClick={() => addToCart(item)}>Add to cart</button>
                            </div>
                        ))}
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Restaurants;
