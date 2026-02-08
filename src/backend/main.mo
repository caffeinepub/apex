import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";




actor {
  include MixinStorage();

  type Category = {
    #performance;
    #aesthetics;
  };

  type Habit = {
    id : Text;
    category : Category;
    name : Text;
    description : Text;
    ease : Int;
    effectiveness : Int;
    affordability : Int;
    anecdotes : Text;
    isCritical : Bool; // Renamed from isPrime
    totalScore : Int;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  module Habit {
    public func compare(h1 : Habit, h2 : Habit) : Order.Order {
      switch (Bool.compare(h2.isCritical, h1.isCritical)) {
        case (#equal) {
          switch (Int.compare(h2.totalScore, h1.totalScore)) {
            case (#equal) { Text.compare(h1.name, h2.name) };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  let habits = Map.empty<Text, Habit>();
  let galleryImages = Map.empty<Text, Storage.ExternalBlob>();

  var headerTitle : Text = "Habit Tier List";

  func calculateTotalScore(ease : Int, effectiveness : Int, affordability : Int) : Int {
    ease + effectiveness + affordability;
  };

  func getCriticalHabitCount(category : Category) : Nat {
    var count = 0;
    for ((_, habit) in habits.entries()) {
      if (habit.category == category and habit.isCritical) {
        count += 1;
      };
    };
    count;
  };

  public shared ({ caller }) func addHabit(
    id : Text,
    category : Category,
    name : Text,
    description : Text,
    ease : Int,
    effectiveness : Int,
    affordability : Int,
    anecdotes : Text,
    isCritical : Bool,
  ) : async Habit {
    let criticalCount = getCriticalHabitCount(category);

    if (isCritical and criticalCount >= 7) {
      Runtime.trap("Cannot have more than 7 Critical habits per category");
    };

    if (habits.containsKey(id)) {
      Runtime.trap("Habit with this ID already exists");
    };

    let totalScore = calculateTotalScore(ease, effectiveness, affordability);
    let currentTime = Time.now();

    let habit : Habit = {
      id;
      category;
      name;
      description;
      ease;
      effectiveness;
      affordability;
      anecdotes;
      isCritical;
      totalScore;
      createdAt = currentTime;
      updatedAt = currentTime;
    };

    habits.add(id, habit);
    habit;
  };

  public shared ({ caller }) func editHabit(
    id : Text,
    category : Category,
    name : Text,
    description : Text,
    ease : Int,
    effectiveness : Int,
    affordability : Int,
    anecdotes : Text,
    isCritical : Bool,
  ) : async Habit {
    switch (habits.get(id)) {
      case (null) {
        Runtime.trap("Habit not found");
      };
      case (?existingHabit) {
        let criticalCount = getCriticalHabitCount(category);

        if (isCritical and not existingHabit.isCritical and criticalCount >= 7) {
          Runtime.trap("Cannot have more than 7 Critical habits per category");
        };

        let totalScore = calculateTotalScore(ease, effectiveness, affordability);
        let updatedHabit : Habit = {
          id;
          category;
          name;
          description;
          ease;
          effectiveness;
          affordability;
          anecdotes;
          isCritical;
          totalScore;
          createdAt = existingHabit.createdAt;
          updatedAt = Time.now();
        };
        habits.add(id, updatedHabit);
        updatedHabit;
      };
    };
  };

  public shared ({ caller }) func deleteHabit(id : Text) : async () {
    if (habits.containsKey(id)) {
      habits.remove(id);
    } else {
      Runtime.trap("Habit not found");
    };
  };

  public query ({ caller }) func getHabit(id : Text) : async Habit {
    switch (habits.get(id)) {
      case (null) { Runtime.trap("Habit not found") };
      case (?habit) { habit };
    };
  };

  public query ({ caller }) func getAllHabits() : async [Habit] {
    habits.values().toArray().sort();
  };

  public query ({ caller }) func getHabitsByCategory(category : Category) : async [Habit] {
    let filtered = habits.values().filter(
      func(habit) { habit.category == category }
    );
    filtered.toArray().sort();
  };

  type GalleryAddImageResponse = {
    id : Text;
    success : Bool;
    message : ?Text;
    blob : ?Storage.ExternalBlob;
  };

  /// Photo Gallery Management
  public shared ({ caller }) func addGalleryImage(id : Text, blob : Storage.ExternalBlob) : async GalleryAddImageResponse {
    galleryImages.add(id, blob);
    let response : ?Text = ?"Image added successfully!";
    {
      id;
      success = true;
      message = response;
      blob = ?blob;
    };
  };

  public shared ({ caller }) func removeGalleryImage(id : Text) : async () {
    switch (galleryImages.get(id)) {
      case (null) { Runtime.trap("Image not found") };
      case (?_) {
        galleryImages.remove(id);
      };
    };
  };

  public query ({ caller }) func getGalleryImages() : async [(Text, Storage.ExternalBlob)] {
    galleryImages.toArray();
  };

  public query ({ caller }) func getGalleryImage(id : Text) : async Storage.ExternalBlob {
    switch (galleryImages.get(id)) {
      case (null) { Runtime.trap("Image not found") };
      case (?image) { image };
    };
  };

  public shared ({ caller }) func updateHeaderTitle(newTitle : Text) : async () {
    headerTitle := newTitle;
  };

  public query ({ caller }) func getHeaderTitle() : async Text {
    headerTitle;
  };
};
