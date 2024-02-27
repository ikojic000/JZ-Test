$(document).ready(function () {
  const peopleCount = 10;
  const teamCount = peopleCount / 2;
  let people = [];

  $("#addPerson").click(function () {
    if ($(".person").length === peopleCount) {
      alert("Ne možete dodati više od " + peopleCount + " ljudi.");
      return;
    }
    $("#personInputs").append(
      '<div class="person"><input type="text" class="name" placeholder="Name"><input type="number" class="score" placeholder="Koeficijent"><button class="removePerson">X</button></div>'
    );

    // Set focus to the name input of the newly created .person
    $(".person:last-child .name").focus();
  });

  $("#clearAll").click(function () {
    $("#personInputs").empty();
    $(".card-team").parent().css("display", "none");
    $("#addPerson").trigger("click");
  });

  $(document).on("click", ".removePerson", function () {
    if ($(".person").length === 1) {
      alert("Ne možete maknuti posljednju osobu.");
      return;
    }

    $(this).parent().remove();
  });

  $("#balanceTeams").click(function () {
    people = [];
    $(".person").each(function () {
      let name = $(this).find(".name").val();
      let score = parseFloat($(this).find(".score").val());
      if (name !== "" && !isNaN(score) && score >= 0 && score <= 100) {
        people.push({ name: name, score: score });
      }
    });

    if (people.length !== peopleCount) {
      alert("Molim unesite točno " + peopleCount + " ljudi!");
      return;
    }

    // Sort people by score in descending order
    people.sort((a, b) => b.score - a.score);

    let bestTeam1 = [];
    let bestTeam2 = [];
    let bestDifference = Infinity;

    // Recursive function to find the best combination of players
    function findBestTeams(team1, team2, index) {
      if (index === people.length) {
        let score1 = team1.reduce((acc, cur) => acc + cur.score, 0);
        let score2 = team2.reduce((acc, cur) => acc + cur.score, 0);
        let difference = Math.abs(score1 - score2);
        if (
          difference < bestDifference &&
          team1.length === teamCount &&
          team2.length === teamCount
        ) {
          bestDifference = difference;
          bestTeam1 = team1.slice();
          bestTeam2 = team2.slice();
        }
        return;
      }

      // Add current player to team 1
      findBestTeams([...team1, people[index]], team2, index + 1);

      // Add current player to team 2
      findBestTeams(team1, [...team2, people[index]], index + 1);
    }

    // Start recursive function to find the best teams
    findBestTeams([], [], 0);

    // Display teams
    displayTeam("team1", bestTeam1);
    displayTeam("team2", bestTeam2);
  });

  function displayTeam(teamId, team) {
    $(".card-team").parent().css("display", "grid");
    $("#" + teamId).empty();
    let totalScore = 0;
    team.forEach(function (person) {
      $("#" + teamId).append(
        "<li>" + person.name + " - " + person.score + "</li>"
      );
      totalScore += person.score;
    });
    $("#" + teamId).append(
      "<li>Ukupan koeficijent: " + totalScore.toFixed(2) + "</li>"
    );
  }

  // Event listener for Enter key press
  $(document).keypress(function (event) {
    if (event.which === 13) {
      $("#addPerson").trigger("click");
    }
  });

  $(document).on("keydown", function (event) {
    // Check if Ctrl key and Enter key are pressed simultaneously
    if (event.ctrlKey && event.key === "Enter") {
      $("#balanceTeams").trigger("click");
    }
  });

  // Event listener for Backspace key
  $(document).keydown(function (e) {
    if (e.which === 8 && !$("input:focus").length) {
      if ($(".person").length === 1) {
        alert("Ne možete maknuti posljednju osobu.");
        return;
      }

      $(".person:last-child").remove();
    }
  });

  // Event listener for the Delete key
  $(document).on("keydown", function (event) {
    if (event.which === 46) {
      $("#clearAll").trigger("click");
    }
  });

  const stringList = [
    "jz",
    "zrile",
    "josip",
    "zrilic",
    "zrilić",
    "josip zrilic",
    "josip zrilić",
    "zrilic josip",
    "zrilić josip",
  ];

  // Event listener for name input field
  $(document).on("input", ".name", function () {
    let enteredName = $(this).val().trim().toLowerCase();
    if (stringList.includes(enteredName)) {
      $(this).val(enteredName + " homoseksualac");
    }
  });
});
