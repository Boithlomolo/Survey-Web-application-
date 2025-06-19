function showSurvey() {
    document.getElementById("survey-screen").style.display = "block";
    document.getElementById("results-screen").style.display = "none";
}

function showResults() {
    document.getElementById("survey-screen").style.display = "none";
    document.getElementById("results-screen").style.display = "block";
    displayResults();
}

document.getElementById("surveyForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const dob = new Date(document.getElementById("dob").value);
    const contact = document.getElementById("contact").value.trim();
    const age = new Date().getFullYear() - dob.getFullYear();

    if (!name || !email || !dob || !contact) {
        alert("Please fill out all fields.");
        return;
    }

    if (age < 5 || age > 120) {
        alert("Age must be between 5 and 120.");
        return;
    }

    const foods = Array.from(document.querySelectorAll("input[name='food']:checked")).map(el => el.value);
    if (foods.length === 0) {
        alert("Select at least one food.");
        return;
    }

    const ratings = ["q1", "q2", "q3", "q4"].map(q => {
        const value = document.querySelector(`input[name='${q}']:checked`);
        if (!value) {
            alert("Please answer all rating questions.");
            throw new Error("Missing rating");
        }
        return parseInt(value.value);
    });

    const survey = {
        name,
        email,
        dob: dob.toISOString().split("T")[0],
        contact,
        age,
        foods,
        ratings
    };

    let surveys = JSON.parse(localStorage.getItem("surveys")) || [];
    surveys.push(survey);
    localStorage.setItem("surveys", JSON.stringify(surveys));

    alert("Survey submitted!");
    this.reset();
});

function displayResults() {
    const surveys = JSON.parse(localStorage.getItem("surveys")) || [];
    if (surveys.length === 0) {
        document.getElementById("results-output").innerHTML = "<p>No Surveys Available.</p>";
        return;
    }

    const total = surveys.length;
    const ages = surveys.map(s => s.age);
    const avgAge = (ages.reduce((a, b) => a + b) / total);
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);

    const pizzaCount = surveys.filter(s => s.foods.includes("Pizza")).length;
    const pizzaPercentage = ((pizzaCount / total) * 100).toFixed(1);

    const pastaCount = surveys.filter(s => s.foods.includes("Pasta")).length;
    const pastaPercentage = ((pastaCount / total) * 100).toFixed(1);

    const pandwCount = surveys.filter(s => s.foods.includes("Pap and Wors")).length;
    const pandwPercentage = ((pandwCount / total) * 100).toFixed(1);

    const otherCount = surveys.filter(s => s.foods.includes("Other")).length;
    const otherPercentage = ((otherCount / total) * 100).toFixed(1);

    const movies = (surveys.map(s => s.ratings[0]).reduce((a, b) => a + b)).toFixed(1);

    const eat = (surveys.map(s => s.ratings[1]).reduce((a, b) => a + b)).toFixed(1);

    const radio = (surveys.map(s => s.ratings[2]).reduce((a, b) => a + b)).toFixed(1);

    const tv = (surveys.map(s => s.ratings[3]).reduce((a, b) => a + b)).toFixed(1);

    document.getElementById("results-output").innerHTML = `
      <p><strong>Total Number of surveys:</strong> ${total}</p>
      <p><strong>Average Age:</strong> ${avgAge}</p>
      <p><strong>Oldest person who parcitipated in survey:</strong> ${maxAge}</p>
      <p><strong>Youngest person who parcitipated in survey:</strong> ${minAge}</p>

      <p><strong>Percentage of people who like Pizza:</strong> ${pizzaPercentage}%</p>
      <p><strong>Percentage of people who like Pasta:</strong> ${pastaPercentage}%</p>
      <p><strong>Percentage of people who like Pap and Wors:</strong> ${pandwPercentage}%</p>
            <p><strong>Percentage of people who like others:</strong> ${otherPercentage}%</p>

      <p><strong>People who like to watch movies :</strong> ${movies}</p>
      <p><strong>People who like to eat out :</strong> ${eat}</p>
      <p><strong>People who like to listen to radio :</strong> ${radio}</p>
      <p><strong>People who like to watch TV :</strong> ${tv}</p>
    `;
}
