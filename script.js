$(document).ready(function () {
  const peopleCount = 10;
  const teamCount = peopleCount / 2;
  let people = [];

  // Function to add a person input
  function addPersonInput() {
    if ($(".person").length === peopleCount) {
      alert("Ne možete dodati više od " + peopleCount + " ljudi.");
      return;
    }
    $("#personInputs").append(
      '<div class="person"><input type="text" class="name" placeholder="Name"><input type="number" class="score" placeholder="Koeficijent"><button class="removePerson">X</button></div>'
    );

    $(".person:last-child .name").focus();
  }

  // Function to remove a person input
  function removePersonInput() {
    if ($(".person").length === 1) {
      alert("Ne možete maknuti posljednju osobu.");
      return;
    }
    $(".person:last-child").remove();
  }

  // Function to clear all person inputs
  function clearAllPersonInputs() {
    $("#personInputs").empty();
    $(".card-team").parent().css("display", "none");
    addPersonInput();
  }

  // Function to handle team balancing
  function balanceTeams() {
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

    displayTeam("team1", bestTeam1);
    displayTeam("team2", bestTeam2);
  }

  // Function to display a team
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
      "<p>Ukupan koeficijent: " + totalScore.toFixed(2) + "</p>"
    );

    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  }

  // Event listener for adding a person input
  $("#addPerson").click(addPersonInput);

  // Event listener for clearing all person inputs
  $("#clearAll").click(clearAllPersonInputs);

  // Event listener for removing a person input
  $(document).on("click", ".removePerson", removePersonInput);

  // Event listener for balancing teams
  $("#balanceTeams").click(balanceTeams);

  // Event listener for Enter key press
  $(document).keypress(function (event) {
    if (event.which === 13) {
      addPersonInput();
    }
  });

  // Event listener for Ctrl + Enter key press
  $(document).on("keydown", function (event) {
    if (event.ctrlKey && event.key === "Enter") {
      balanceTeams();
    }
  });

  // Event listener for Backspace key
  $(document).keydown(function (e) {
    if (e.which === 8 && !$("input:focus").length) {
      removePersonInput();
    }
  });

  // Event listener for the Delete key
  $(document).on("keydown", function (event) {
    if (event.which === 46) {
      clearAllPersonInputs();
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
    "joso"
  ];

  // Event listener for name input field
  $(document).on("input", ".name", function () {
    let enteredName = $(this).val().trim().toLowerCase();
    if (stringList.includes(enteredName)) {
      $(this).val(enteredName + " homoseksualac");
    }
  });
});
