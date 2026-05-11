let selectedSlot = "";

const slots = document.querySelectorAll(".slot");

slots.forEach(slot => {

  slot.addEventListener("click", () => {

    slots.forEach(btn => btn.classList.remove("selected"));

    slot.classList.add("selected");

    selectedSlot = slot.innerText;

  });

});

document.getElementById("bookBtn").addEventListener("click", async () => {

  const date = document.getElementById("bookingDate").value;

  const mobile = document.getElementById("mobile").value;

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

  document.getElementById("message").innerText =
  "✅ Booking Confirmed";

});