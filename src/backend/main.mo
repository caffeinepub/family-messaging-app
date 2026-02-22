import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Product types and state
  public type Product = {
    name : Text;
    description : Text;
    price : Nat;
    image : Storage.ExternalBlob;
  };

  // Shopping cart state
  public type CartItem = {
    product : Product;
    quantity : Nat;
  };

  public type ShoppingCart = {
    items : [CartItem];
    total : Nat;
  };

  // User profile type
  public type UserProfile = {
    name : Text;
    email : Text;
    shippingAddress : Text;
  };

  let products = Map.empty<Text, Product>();
  let carts = Map.empty<Principal, ShoppingCart>();
  let orders = Map.empty<Text, ShoppingCart>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Core authorization and storage infrastructure
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  ///////////////////////////////////////////////////////////////////////
  // User Profile Management
  ///////////////////////////////////////////////////////////////////////

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  ///////////////////////////////////////////////////////////////////////
  // Product catalogue and store management
  ///////////////////////////////////////////////////////////////////////

  public shared ({ caller }) func createProduct(id : Text, name : Text, description : Text, price : Nat, image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    if (products.containsKey(id)) {
      Runtime.trap("Product with ID already exists");
    };

    let newProduct : Product = {
      name;
      description;
      price;
      image;
    };
    products.add(id, newProduct);
  };

  public query func getProduct(productId : Text) : async ?Product {
    products.get(productId);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    if (products.containsKey(productId)) {
      products.remove(productId);
    } else {
      Runtime.trap("Product not found");
    };
  };

  public shared ({ caller }) func updateProductPrice(productId : Text, newPrice : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update product prices");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        let updatedProduct : Product = {
          existingProduct with price = newPrice;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  ///////////////////////////////////////////////////////////////////////
  // Shopping cart and ordering process
  ///////////////////////////////////////////////////////////////////////

  func getCartTotal(cart : ShoppingCart) : Nat {
    var total = 0;
    for (item in cart.items.values()) {
      total += item.product.price * item.quantity;
    };
    total;
  };

  public shared ({ caller }) func addItemToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let cart = switch (carts.get(caller)) {
          case (null) {
            {
              items = [];
              total = 0;
            };
          };
          case (?existingCart) { existingCart };
        };

        let newCartItem : CartItem = {
          product;
          quantity;
        };

        let updatedItems = cart.items.concat([newCartItem]);
        let updatedTotal = getCartTotal({
          cart with items = updatedItems;
        });

        let updatedCart : ShoppingCart = {
          items = updatedItems;
          total = updatedTotal;
        };

        carts.add(caller, updatedCart);
      };
    };
  };

  public shared ({ caller }) func removeItemFromCart(itemIndex : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };

    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Shopping cart not found") };
      case (?cart) {
        if (itemIndex >= cart.items.size()) { Runtime.trap("Invalid index") };

        let updatedItems = Array.tabulate(
          cart.items.size() - 1,
          func(i) {
            if (i < itemIndex) { cart.items[i] } else {
              cart.items[i + 1];
            };
          },
        );

        let updatedTotal = getCartTotal({
          cart with items = updatedItems;
        });

        let updatedCart : ShoppingCart = {
          items = updatedItems;
          total = updatedTotal;
        };

        carts.add(caller, updatedCart);
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };

    let emptyCart : ShoppingCart = {
      items = [];
      total = 0;
    };
    carts.add(caller, emptyCart);
  };

  public query ({ caller }) func getCart() : async ShoppingCart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get cart");
    };

    switch (carts.get(caller)) {
      case (null) {
        var cart : ShoppingCart = {
          items = [];
          total = 0;
        };
        cart;
      };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func checkout() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can checkout");
    };

    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Shopping cart not found") };
      case (?cart) {
        let orderId = "order-" # debug_show (caller);

        orders.add(orderId, cart);

        let emptyCart : ShoppingCart = {
          items = [];
          total = 0;
        };
        carts.add(caller, emptyCart);
      };
    };
  };
};
