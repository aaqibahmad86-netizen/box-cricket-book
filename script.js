let selectedSlot = "";

const slots = document.querySelectorAll(".slot");

slots.forEach(slot => {

  // Original slot text save
  slot.dataset.original = slot.innerText;

  slot.addEventListener("click", () => {

    if(slot.classList.contains("booked")) return;

    slots.forEach(btn =>
      btn.classList.remove("selected")
    );

    slot.classList.add("selected");

    selectedSlot = slot.dataset.original;

  });

});

async function loadBookings(){

  const date =
  document.getElementById("bookingDate").value;

  // Reset all slots
  slots.forEach(slot => {

    slot.classList.remove("booked");

    slot.classList.remove("selected");

    slot.innerText = slot.dataset.original;

  });

  const querySnapshot =
  await getDocs(collection(db, "bookings"));

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    if(data.date == date){

      slots.forEach(slot => {

        if(slot.dataset.original == data.slot){

          slot.classList.add("booked");

          slot.innerText =
          slot.dataset.original + " ❌";

        }

      });

    }

  });

}

document
.getElementById("bookingDate")
.addEventListener("change", loadBookings);

document
.getElementById("bookBtn")
.addEventListener("click", async () => {

  const date =
  document.getElementById("bookingDate").value;

  const mobile =
  document.getElementById("mobile").value;

  if(date == "" || selectedSlot == "" || mobile == ""){
    alert("Please fill all details");
    return;
  }

  // Prevent double booking
  let alreadyBooked = false;

  const querySnapshot =
  await getDocs(collection(db, "bookings"));

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    if(
      data.date == date &&
      data.slot == selectedSlot
    ){
      alreadyBooked = true;
    }

  });

  if(alreadyBooked){

    alert("Slot already booked");

    return;

  }

await addDoc(collection(db, "bookings"), {

  date: date,

  slot: selectedSlot,

  mobile: mobile,

  createdAt: new Date()

});
  document.getElementById("message")
  .innerText = "✅ Booking Confirmed";

const customerMsg =
`https://wa.me/91${mobile}?text=
🏏 Booking Confirmed

📅 Date: ${date}

⏰ Slot: ${selectedSlot}

💰 Amount: ₹900

Thank You`;

window.open(customerMsg, "_blank");

const adminMsg =
`https://wa.me/918860172386?text=
🔥 New Booking Received

📅 Date: ${date}

⏰ Slot: ${selectedSlot}

📱 Customer: ${mobile}

💰 Amount: ₹900`;

window.open(adminMsg, "_blank");

  loadBookings();

});
