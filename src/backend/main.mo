import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

actor {
  type Message = {
    sender : Principal;
    content : Text;
    timestamp : Int;
  };

  type UserProfile = {
    userID : Principal;
    username : Text;
    messages : [Message];
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func registerUser(username : Text) : async () {
    if (userProfiles.containsKey(caller)) { Runtime.trap("User already exists") };

    let newUser : UserProfile = {
      userID = caller;
      username;
      messages = [];
    };

    userProfiles.add(caller, newUser);
  };

  public query ({ caller }) func getUserProfile() : async UserProfile {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    userProfiles.values().toArray();
  };

  public shared ({ caller }) func sendMessage(recipientID : Principal, content : Text, timestamp : Int) : async () {
    let senderProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Sender does not exist") };
      case (?profile) { profile };
    };

    let recipientProfile = switch (userProfiles.get(recipientID)) {
      case (null) { Runtime.trap("Recipient does not exist") };
      case (?profile) { profile };
    };

    let newMessage : Message = {
      sender = caller;
      content;
      timestamp;
    };

    let updatedMessages = recipientProfile.messages.concat([newMessage]);
    let updatedProfile = { recipientProfile with messages = updatedMessages };
    userProfiles.add(recipientID, updatedProfile);
  };

  public query ({ caller }) func getMessages() : async [Message] {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) { profile.messages };
    };
  };

  public shared ({ caller }) func clearMessages() : async () {
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) { profile };
    };

    let updatedProfile = { profile with messages = [] };
    userProfiles.add(caller, updatedProfile);
  };

  public query func getFamilyMemberList() : async [UserProfile] {
    userProfiles.values().toArray();
  };
};
