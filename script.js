let selectedSlots = [];

const slots =
document.querySelectorAll(".slot");

const totalAmount =
document.getElementById("totalAmount");

const SLOT_PRICE = 900;

// MULTI SLOT SELECT

slots.forEach(slot => {

  slot.dataset.original =
  slot.innerText;

  slot.addEventListener("click", () => {

    if(slot.classList.contains("booked"))
    return;

    const slotName =
    slot.dataset.original;

    // REMOVE SLOT

    if(selectedSlots.includes(slotName)){

      selectedSlots =
      selectedSlots.filter(
        s => s != slotName
      );

      slot.classList.remove("selected");

    }

    // ADD SLOT

    else{

      selectedSlots.push(slotName);

      slot.classList.add("selected");

    }

    updateTotal();

  });

});

// TOTAL AMOUNT

function updateTotal(){

  totalAmount.innerText =
  `Total Amount ₹${selectedSlots.length * SLOT_PRICE}`;

}

// LOAD BOOKINGS

async function loadBookings(){

  const date =
  document.getElementById("bookingDate").value;

  slots.forEach(slot => {

    slot.classList.remove("booked");

    slot.classList.remove("selected");

    slot.innerText =
    slot.dataset.original;

  });

  selectedSlots = [];

  updateTotal();

  const querySnapshot =
  await getDocs(collection(db, "bookings"));

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    if(data.date == date){

      data.slots.forEach(bookedSlot => {

        slots.forEach(slot => {

          if(
            slot.dataset.original ==
            bookedSlot
          ){

            slot.classList.add("booked");

            slot.innerText =
            bookedSlot + " ❌";

          }

        });

      });

    }

  });

}

document
.getElementById("bookingDate")
.addEventListener("change", loadBookings);

// BOOK SLOT

document
.getElementById("bookBtn")
.addEventListener("click", async () => {

  const date =
  document.getElementById("bookingDate").value;

  const mobile =
  document.getElementById("mobile").value;

  if(
    date == "" ||
    mobile == "" ||
    selectedSlots.length == 0
  ){

    alert("Please fill all details");

    return;

  }

  // CHECK DOUBLE BOOKING

  let alreadyBooked = false;

  const querySnapshot =
  await getDocs(collection(db, "bookings"));

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    if(data.date == date){

      selectedSlots.forEach(selSlot => {

        if(data.slots.includes(selSlot)){

          alreadyBooked = true;

        }

      });

    }

  });

  if(alreadyBooked){

    alert(
      "One or more slots already booked"
    );

    return;

  }

  // SAVE BOOKING

  await addDoc(collection(db, "bookings"), {

    date: date,

    slots: selectedSlots,

    mobile: mobile,

    amount:
    selectedSlots.length * SLOT_PRICE,

    createdAt: new Date()

  });

  document.getElementById("message")
  .innerText =
  "✅ Booking Confirmed";

  // CUSTOMER WHATSAPP

  const customerMsg =
  `https://wa.me/91${mobile}?text=
🏏 Booking Confirmed

📅 Date: ${date}

⏰ Slots:
${selectedSlots.join(", ")}

💰 Amount:
₹${selectedSlots.length * SLOT_PRICE}`;

  window.open(customerMsg, "_blank");

  // ADMIN WHATSAPP

  setTimeout(() => {

    const adminMsg =
    `https://wa.me/918860172386?text=
🔥 NEW BOOKING

📅 Date: ${date}

⏰ Slots:
${selectedSlots.join(", ")}

📱 Customer:
${mobile}

💰 Amount:
₹${selectedSlots.length * SLOT_PRICE}`;

    window.location.href = adminMsg;

  }, 1200);

  loadBookings();

});

// MORNING / NIGHT TAB

const morningBtn =
document.getElementById("morningBtn");

const nightBtn =
document.getElementById("nightBtn");

const morningSlots =
document.getElementById("morningSlots");

const nightSlots =
document.getElementById("nightSlots");

morningBtn.addEventListener("click", () => {

  morningSlots.classList.remove("hidden");

  nightSlots.classList.add("hidden");

});

nightBtn.addEventListener("click", () => {

  nightSlots.classList.remove("hidden");

  morningSlots.classList.add("hidden");

});
