const bookingsList =
document.getElementById("bookingsList");

const totalBookings =
document.getElementById("totalBookings");

const totalRevenue =
document.getElementById("totalRevenue");

document
.getElementById("loadBtn")
.addEventListener("click", loadBookings);

function formatTime(time){

  const [hour, minute] =
  time.split(":");

  let h = parseInt(hour);

  let ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;

  h = h ? h : 12;

  return `${h}:${minute} ${ampm}`;

}

async function loadBookings(){

  bookingsList.innerHTML = "";

  let total = 0;

  let revenue = 0;

  const fromDate =
  document.getElementById("fromDate").value;

  const toDate =
  document.getElementById("toDate").value;

  const querySnapshot =
  await getDocs(collection(db, "bookings"));

  querySnapshot.forEach((docSnap) => {

    const data = docSnap.data();

    if(
      fromDate &&
      toDate &&
      (
        data.date < fromDate ||
        data.date > toDate
      )
    ){

      return;

    }

    total++;

    revenue += Number(data.amount);

    const start =
    data.startTime;

    const hrs =
    parseInt(data.duration);

    const end =
    new Date();

    const [h,m] =
    start.split(":");

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

    bookingsList.innerHTML += `

      <div class="bookingCard">

        <h3>📅 ${data.date}</h3>

        <p>
        ⏰
        ${formatTime(start)}
        →
        ${formatTime(endHour+":"+endMin)}
        </p>

        <p>
        🕒 ${data.duration} Hour
        </p>

        <p>
        💰 ₹${data.amount}
        </p>

        <p>
        📱 ${data.mobile}
        </p>

        <button onclick="deleteBooking('${docSnap.id}')">

          Delete

        </button>

      </div>

    `;

  });

  totalBookings.innerText = total;

  totalRevenue.innerText = revenue;

}

window.deleteBooking =
async function(id){

  await deleteDoc(doc(db, "bookings", id));

  loadBookings();

}
