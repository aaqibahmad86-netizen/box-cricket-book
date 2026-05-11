let selectedSlot = "";

const slots = document.querySelectorAll(".slot");

slots.forEach(slot => {

  slot.addEventListener("click", () => {

    if(slot.classList.contains("booked")) return;

    slots.forEach(btn => btn.classList.remove("selected"));

    slot.classList.add("selected");

    selectedSlot = slot.innerText;

  });

});

async function loadBookings(){

  const date = document.getElementById("bookingDate").value;

  slots.forEach(slot => {
    slot.classList.remove("booked");
  });

  const querySnapshot =
  await getDocs(collection(db, "bookings"));

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    if(data.date == date){

      slots.forEach(slot => {

        if(slot.innerText == data.slot){

          slot.classList.add("booked");

          slot.innerText = "BOOKED";

        }

      });

    }

  });

}

document.getElementById("bookingDate")
.addEventListener("change", loadBookings);

document.getElementById("bookBtn")
.addEventListener("click", async () => {

  const date =
  document.getElementById("bookingDate").value;

  const mobile =
  document.getElementById("mobile").value;

  if(date == "" || selectedSlot == "" || mobile == ""){
    alert("Please fill all details");
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

  window.open(
    `https://wa.me/91${mobile}?text=🏏 Your Booking Confirmed for ${selectedSlot} on ${date}`,
    "_blank"
  );

  loadBookings();

});
