const startTime =
document.getElementById("startTime");

const duration =
document.getElementById("duration");

const summary =
document.getElementById("timeSummary");

const totalAmount =
document.getElementById("totalAmount");

const SLOT_PRICE = 900;

// CREATE 24 HOUR TIME OPTIONS

for(let h=0; h<24; h++){

  for(let m=0; m<60; m+=30){

    const option =
    document.createElement("option");

    const hour =
    h.toString().padStart(2,"0");

    const minute =
    m.toString().padStart(2,"0");

    option.value = `${hour}:${minute}`;

    option.text =
    formatTime(hour, minute);

    startTime.appendChild(option);

  }

}

function formatTime(hour, minute){

  let h = parseInt(hour);

  let ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;

  h = h ? h : 12;

  return `${h}:${minute} ${ampm}`;

}

function updateSummary(){

  const start =
  startTime.value;

  const hrs =
  parseInt(duration.value);

  const [h,m] =
  start.split(":");

  const end =
  new Date();

  end.setHours(parseInt(h) + hrs);

  end.setMinutes(parseInt(m));

  let endHour =
  end.getHours()
  .toString()
  .padStart(2,"0");

  let endMin =
  end.getMinutes()
  .toString()
  .padStart(2,"0");

  summary.innerText =
  `${formatTime(h,m)} → ${formatTime(endHour,endMin)}`;

  totalAmount.innerText =
  `₹${hrs * SLOT_PRICE}`;

}

startTime.addEventListener(
  "change",
  updateSummary
);

duration.addEventListener(
  "change",
  updateSummary
);

updateSummary();

document
.getElementById("bookBtn")
.addEventListener("click", async () => {

  const date =
  document.getElementById("bookingDate").value;

  const mobile =
  document.getElementById("mobile").value;

  const start =
  startTime.value;

  const hrs =
  duration.value;

  if(date == "" || mobile == ""){

    alert("Fill all details");

    return;

  }
  // CHECK OVERLAP BOOKING

const querySnapshot =
await getDocs(collection(db, "bookings"));

let alreadyBooked = false;

const newStart =
convertToMinutes(start);

const newEnd =
newStart + (hrs * 60);

querySnapshot.forEach((docSnap) => {

  const data = docSnap.data();

  if(data.date == date){

    const oldStart =
    convertToMinutes(data.startTime);

    const oldEnd =
    oldStart + (data.duration * 60);

    // OVERLAP CHECK

    if(
      newStart < oldEnd &&
      newEnd > oldStart
    ){

      alreadyBooked = true;

    }

  }

});

if(alreadyBooked){

  alert(
    "This time slot is already booked"
  );

  return;

}

  await addDoc(collection(db, "bookings"), {

    date: date,

    startTime: start,

    duration: hrs,

    mobile: mobile,

    amount: hrs * SLOT_PRICE,

    createdAt: new Date()

  });

  document.getElementById("message")
  .innerText = "✅ Booking Confirmed";

  alert("Booking Successful");

});
function convertToMinutes(time){

  const [h,m] = time.split(":");

  return (
    parseInt(h) * 60 +
    parseInt(m)
  );

}
