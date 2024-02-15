import { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleAddFriendButton() {
    setShowAddFriend((show) => !show);
  }
  function handleSelectedFriend(friend) {
    setSelectedFriend(friend.id === selectedFriend?.id ? null : friend);
    setShowAddFriend(false);
  }
  function handleAddNewFriend(newfriend) {
    setFriends((friends) => [...friends, newfriend]);
  }
  function handleSplitBill(value) {
    // console.log(value);
    setFriends((friends) =>
      friends.map((friendElement) =>
        friendElement.id === selectedFriend.id
          ? { ...friendElement, balance: friendElement.balance + value }
          : friendElement
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectBtn={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && (
          <FormAddFriend
            onClickAddFriendBtn={handleAddFriendButton}
            onAddNewFriend={handleAddNewFriend}
          />
        )}
        <Button onClick={handleAddFriendButton}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelectBtn, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelectBtn={onSelectBtn}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectBtn, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance !== 0 ? (
        friend.balance < 0 ? (
          <p className="red">
            You owe {friend.name} ${Math.abs(friend.balance)}
          </p>
        ) : (
          <p className="green">
            {friend.name} owe you ${friend.balance}
          </p>
        )
      ) : (
        <p>You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelectBtn(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onClickAddFriendBtn, onAddNewFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = { id, name, image: `${image}${id}`, balance: 0 };
    // console.log(newFriend);
    onAddNewFriend(newFriend);
    // setName("");
    // setImage("https://i.pravatar.cc/48?u=");
    onClickAddFriendBtn();
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => handleSubmit(e)}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌆 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  console.log(selectedFriend);
  const [bill, setbill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const friendExpense = bill - userExpense;
  function handleSubmitSplitForm(e) {
    e.preventDefault();
    if (!bill || !userExpense) return;
    /*-ve means i have to pay him and +ve value implies he have to pay me. So, if he is paying the bill then value should be +ve else -ve */
    onSplitBill(whoIsPaying === "user" ? friendExpense : -userExpense);
  }
  return (
    <form
      className="form-split-bill"
      onSubmit={(e) => handleSubmitSplitForm(e)}
    >
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(+e.target.value)}
      />
      <label>🧍🏻Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          Number(e.target.value) > bill ? bill : setUserExpense(+e.target.value)
        }
      />
      <label>🧑‍🤝‍🧑 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={friendExpense} />
      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
