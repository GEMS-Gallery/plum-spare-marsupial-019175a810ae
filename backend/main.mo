import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Result "mo:base/Result";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Option "mo:base/Option";

actor {
  // Define the TaxPayer type
  public type TaxPayer = {
    tid: Text;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store TaxPayer records
  private stable var taxPayerEntries : [(Text, TaxPayer)] = [];

  // Create a HashMap to store TaxPayer records
  private var taxPayers = HashMap.HashMap<Text, TaxPayer>(0, Text.equal, Text.hash);

  // Initialize the HashMap with stable data
  system func preupgrade() {
    taxPayerEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayers := HashMap.fromIter<Text, TaxPayer>(taxPayerEntries.vals(), 0, Text.equal, Text.hash);
    taxPayerEntries := [];
  };

  // Add a new TaxPayer record
  public func addTaxPayer(taxpayer: TaxPayer) : async () {
    taxPayers.put(taxpayer.tid, taxpayer);
  };

  // Get a TaxPayer record by TID
  public query func getTaxPayer(tid: Text) : async ?TaxPayer {
    taxPayers.get(tid)
  };

  // Update an existing TaxPayer record
  public func updateTaxPayer(taxpayer: TaxPayer) : async Bool {
    switch (taxPayers.replace(taxpayer.tid, taxpayer)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  // Delete a TaxPayer record
  public func deleteTaxPayer(tid: Text) : async Bool {
    switch (taxPayers.remove(tid)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  // Get all TaxPayer records
  public query func getAllTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Search for TaxPayer records by TID
  public query func searchTaxPayers(searchTid: Text) : async [TaxPayer] {
    let searchResult = Array.filter<TaxPayer>(Iter.toArray(taxPayers.vals()), func (tp: TaxPayer) : Bool {
      Text.contains(tp.tid, #text searchTid)
    });
    searchResult
  };
}
