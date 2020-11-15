const overviewForm = document.getElementById("overview-form");
const addToOverview = document.getElementById("overview-submit");

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  const schoolName = overviewForm.firstname.value;
  const clubName = overviewForm.lastname.value;
  const advisorName = overviewForm.grade.value;
  const bio = overviewForm.hours.value;

  
  if (schoolName.length != 0 && clubName.length != 0 && advisorName.length != 0) {
    alert("You have edited your overview!");
  }
  else {
    attendanceErrorMsg.style.opacity = 1;
  }

})

