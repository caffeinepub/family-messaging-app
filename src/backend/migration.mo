import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type OldUserProfile = {
    userID : Principal;
    username : Text;
    messages : [Message];
  };

  type Message = {
    sender : Principal;
    content : Text;
    timestamp : Int;
  };

  type Product = {
    name : Text;
    description : Text;
    price : Nat;
    image : Storage.ExternalBlob;
  };

  type CartItem = {
    product : Product;
    quantity : Nat;
  };

  type ShoppingCart = {
    items : [CartItem];
    total : Nat;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    shippingAddress : Text;
  };

  type NewActor = {
    products : Map.Map<Text, Product>;
    carts : Map.Map<Principal, ShoppingCart>;
    orders : Map.Map<Text, ShoppingCart>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    {
      products = Map.empty<Text, Product>();
      carts = Map.empty<Principal, ShoppingCart>();
      orders = Map.empty<Text, ShoppingCart>();
      userProfiles = Map.empty<Principal, UserProfile>();
    };
  };
};
