if(localStorage.getItem("admin") != "true"){

  window.location = "login.html";

}

async function loadBookings(){

  const fromDate =
  document.getElementById("fromDate").value;

  const toDate =
  document.getElementById("toDate").value;

  const bookingsList =
  document.getElementById("bookingsList");

  bookingsList.innerHTML = "";

  let totalBookings = 0;

  let totalRevenue = 0;

  const querySnapshot =
  await getDocs(collection(db, "bookings"));

  querySnapshot.forEach((booking) => {

    const data = booking.data();

    let show = true;

    if(fromDate && data.date < fromDate){
      show = false;
    }

    if(toDate && data.date > toDate){
      show = false;
    }

    if(show){

      totalBookings++;

      // REVENUE

      const bookingAmount =
      data.amount ||
      (
        data.slots
        ? data.slots.length * 900
        : 900
      );

      totalRevenue += bookingAmount;

      // SLOT DISPLAY

      let slotText = "";

      if(data.slots){

        slotText =
        data.slots.join(", ");

      }else{

        slotText = data.slot;

      }

      bookingsList.innerHTML += `

      <div class="bookingCard">

        <h3>
          🏏 ${slotText}
        </h3>

        <p>
          📅 ${data.date}
        </p>

        <p>
          📱 ${data.mobile}
        </p>

        <p>
          💰 ₹${bookingAmount}
        </p>

        <button class="deleteBtn"
        onclick="deleteBooking('${booking.id}')">

          Delete Booking

        </button>

      </div>

      `;

    }

  });

  document.getElementById("totalBookings")
  .innerText = totalBookings;

  document.getElementById("totalRevenue")
  .innerText = totalRevenue;

}

window.deleteBooking = async function(id){

  const confirmDelete =
  confirm("Delete Booking?");

  if(!confirmDelete) return;

  await deleteDoc(doc(db, "bookings", id));

  alert("Deleted");

  loadBookings();

}

document
.getElementById("loadBtn")
.addEventListener("click", loadBookings);

loadBookings();
