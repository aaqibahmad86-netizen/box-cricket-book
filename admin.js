if(localStorage.getItem("admin") != "true"){

  window.location = "login.html";

}

async function loadBookings(){

  const filterDate =
  document.getElementById("filterDate").value;

  const bookingsList =
  document.getElementById("bookingsList");

  bookingsList.innerHTML = "";

  const querySnapshot =
  await getDocs(collection(db, "bookings"));

  querySnapshot.forEach((booking) => {

    const data = booking.data();

    if(filterDate == "" || data.date == filterDate){

      bookingsList.innerHTML += `

      <div class="card">

        <h3>${data.slot}</h3>

        <p>📅 ${data.date}</p>

        <p>📱 ${data.mobile}</p>

       
        <button class="deleteBtn"
onclick="deleteBooking('${booking.id}')">

          Delete Booking

        </button>

      </div>

      `;

    }

  });

}

window.deleteBooking = async function(id){

  const confirmDelete =
  confirm("Delete this booking?");

  if(!confirmDelete) return;

  await deleteDoc(doc(db, "bookings", id));

  alert("Booking Deleted");

  loadBookings();

}

document
.getElementById("loadBtn")
.addEventListener("click", loadBookings);

loadBookings();
