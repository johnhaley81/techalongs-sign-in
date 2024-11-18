import { useState } from 'react'
import logo from './assets/logo.png'
import './App.css'
import {Autocomplete, AutocompleteItem, Button, Card, CardHeader, CardBody } from "@nextui-org/react";
import {Switch} from "@nextui-org/react";


type userType = "Coach" | "Girl Scout (girl)";
type user = {name: string, type: userType};
type gatheringType = "Meeting" | "Competition";
type fieldIds = {
  year: string,
  month: string,
  day: string,
  name: string,
  userType: string,
  gatheringType: string,
};

const fieldIdsReal: fieldIds = {
  year: "entry.1121903622_year",
  month: "entry.1121903622_month",
  day: "entry.1121903622_day",
  name: "entry.918299607",
  userType: "entry.874983456",
  gatheringType: "entry.1953276186",
};
const formIdReal = "1FAIpQLSfCcFjxPyRLpuiBwhX04u1mp2T-ijACJv53Ty3-bEoyfxBxYw";

const fieldIdsTest: fieldIds = {
  year: "entry.1123138479_year",
  month: "entry.1123138479_month",
  day: "entry.1123138479_day",
  name: "entry.1901206475",
  userType: "entry.1291696105",
  gatheringType: "entry.1042279849",
};
const formIdTest = "1FAIpQLScW7xWwIasw-T1QR51DJE97X9Ik2iwXAGLFZIH2xGmJjTiygg";

let useTestForm = true;

const users: user[] = [
  // Girl Scouts
  {name: "Lila Doan", type: "Girl Scout (girl)"},
  {name: "Maya Hamer", type: "Girl Scout (girl)"},
  {name: "Eleanor Lam", type: "Girl Scout (girl)"},
  {name: "Alice Augustine", type: "Girl Scout (girl)"},
  {name: "Margot Davis", type: "Girl Scout (girl)"},
  {name: "Illiana Sinkwitz", type: "Girl Scout (girl)"},
  {name: "Emily Morrow", type: "Girl Scout (girl)"},
  {name: "Victoria Roudin", type: "Girl Scout (girl)"},
  {name: "Aria Haley", type: "Girl Scout (girl)"},
  {name: "Anna McCuistion", type: "Girl Scout (girl)"},

  // Coaches
  {name: "Diana Laulainen-Schein", type: "Coach"},
  {name: "Lia Ryan", type: "Coach"},
  {name: "Christine Langevin", type: "Coach"},
  {name: "Ariana Schein", type: "Coach"},
  {name: "Austin Banghart", type: "Coach"},
  {name: "David Augustine", type: "Coach"},
  {name: "Rebbekka Hirsch", type: "Coach"},
  {name: "Kelly Bellas", type: "Coach"},
  {name: "Lee Kline", type: "Coach"},
  {name: "John Haley", type: "Coach"},
  {name: "Shawn Roduin", type: "Coach"},
  {name: "Dave McCuistion", type: "Coach"},
];

let getFormSubmitUrl = (formId: string) =>
    `https://docs.google.com/forms/d/e/${formId}/formResponse?usp=pp_url`;

const submitGoogleFormViaPrefill = (formId: string, today:Date, name: string, userType: userType, gatheringType: gatheringType) =>
  fetch(
    `${getFormSubmitUrl(formId)}&${new URLSearchParams({
      [useTestForm ? fieldIdsTest.name : fieldIdsReal.name]: name,
      [useTestForm ? fieldIdsTest.userType : fieldIdsReal.userType]: userType,
      [useTestForm ? fieldIdsTest.gatheringType : fieldIdsReal.gatheringType]: gatheringType,
      [useTestForm ? fieldIdsTest.year : fieldIdsReal.year]: today.getFullYear().toString(),
      [useTestForm ? fieldIdsTest.month : fieldIdsReal.month]: (today.getMonth() + 1).toString(),
      [useTestForm ? fieldIdsTest.day : fieldIdsReal.day]: today.getDate().toString(),
    }).toString()}`,
    { mode: 'no-cors' }
  );

type submitState = "idle" | "submitting" | "success" | "error";

function App() {
  const [teamMember, setTeamMember] = useState<user | null>(null);
  const [userType, setUserType] = useState<userType>("Coach");
  const [gatheringType, setGatheringType] = useState<gatheringType>("Meeting");
  const [submitState, setSubmitState] = useState<submitState>("idle");

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Card>
        <CardHeader>
          <div className="flex flex-row w-full items-center justify-center">
            <img src={logo} className="w-28" />
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap w-96 md:flex-nowrap gap-4 flex-col items-center justify-center">
            <Autocomplete
              className="w-auto"
              label="Team Member"
              placeholder="Select a team member"
              isRequired
              selectedKey={teamMember?.name}
              onSelectionChange={key => {
                const user = users.find(user => user.name === key);
                if (user) {
                  setUserType(user.type);
                }

                setTeamMember(user ?? null);
              }}
            >
              {users.sort((a, b) => a.name.localeCompare(b.name)).map((user) => (
                <AutocompleteItem key={user.name} value={user.name}>
                  {user.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <div className="flex flex-col gap-2 items-start w-72">
              <Switch isSelected={userType === "Coach"} onValueChange={value => setUserType(value ? "Coach" : "Girl Scout (girl)")}>
                <div className="flex flex-row gap-2 items-center">
                  <div>Team Member type:</div>
                  {userType === "Coach" ?
                    <div className="font-bold text-sky-500">Coach</div> :
                    <div className="font-bold text-indigo-500">Girl Scout</div>}
                </div>
              </Switch>
              <Switch isSelected={gatheringType === "Competition"} onValueChange={value => setGatheringType(value ? "Competition" : "Meeting")}>
                <div className="flex flex-row gap-2 items-center">
                  <div>Gathering type:</div>
                  {gatheringType === "Competition" ?
                      <div className="font-bold text-sky-500">Competition</div> :
                      <div className="font-bold text-indigo-500">Meeting</div>}
                  </div>
                </Switch>
              </div>
              <Button
                color="primary"
                isLoading={submitState === "submitting"}
                onClick={() => {
                  if (!teamMember?.name) {
                    alert("Please select a team member");
                  } else {
                    setSubmitState("submitting");
                    submitGoogleFormViaPrefill(
                      useTestForm ? formIdTest : formIdReal,
                      new Date(),
                      teamMember.name,
                      userType,
                      gatheringType
                    )
                    .then(() => setSubmitState("success"))
                    .catch(() => setSubmitState("error"));
                  }
                }}
              >
                Submit
              </Button>
              {submitState === "success" && <div className="text-green-500">Form submitted</div>}
              {submitState === "error" && <div className="text-red-500">Error submitting form</div>}
            </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default App
