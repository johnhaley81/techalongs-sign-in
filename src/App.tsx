import { useState } from 'react'
import logo from './assets/logo.png'
import './App.css'
import {Autocomplete, AutocompleteItem, Button} from "@nextui-org/react";
import {Switch} from "@nextui-org/react";


type userType = "Coach" | "Girl Scout";
type user = {name: string, type: userType};
type gatheringType = "Meeting" | "Competition";

const yearFieldId = "entry.1123138479_year";
const monthFieldId = "entry.1123138479_month";
const dayFieldId = "entry.1123138479_day";
const nameFieldId = "entry.1901206475";
const userTypeFieldId = "entry.1291696105";
const gatheringTypeFieldId = "entry.1042279849";
const formId = "1FAIpQLScW7xWwIasw-T1QR51DJE97X9Ik2iwXAGLFZIH2xGmJjTiygg";

const users: user[] = [
  {name: "John Doe", type: "Coach"},
  {name: "Jane Doe", type: "Girl Scout"},
];

let getFormSubmitUrl = (formId: string) =>
    `https://docs.google.com/forms/d/e/${formId}/formResponse?usp=pp_url`;

const submitGoogleFormViaPrefill = (formId: string, today:Date, name: string, userType: userType, gatheringType: gatheringType) =>
  fetch(
    `${getFormSubmitUrl(formId)}&${new URLSearchParams({
      [nameFieldId]: name,
      [userTypeFieldId]: userType,
      [gatheringTypeFieldId]: gatheringType,
      [yearFieldId]: today.getFullYear().toString(),
      [monthFieldId]: (today.getMonth() + 1).toString(),
      [dayFieldId]: today.getDate().toString(),
    }).toString()}`,
    { mode: 'no-cors' }
  )
  .then(() => console.log('Form submitted'))
  .catch(error => console.error('Error:', error));

function App() {
  const [teamMember, setTeamMember] = useState<user | null>(null);
  const [userType, setUserType] = useState<userType>("Coach");
  const [gatheringType, setGatheringType] = useState<gatheringType>("Meeting");

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-wrap w-full md:flex-nowrap gap-4 flex-col items-center justify-center">
        <Autocomplete
        className="max-w-md"
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
        {users.map((user) => (
          <AutocompleteItem key={user.name} value={user.name}>
            {user.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <div className="flex flex-col gap-2 items-start">
        <Switch isSelected={userType === "Coach"} onValueChange={value => setUserType(value ? "Coach" : "Girl Scout")}>
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
      </div>
      <Button
        color="primary"
        onClick={() => teamMember?.name
          ? submitGoogleFormViaPrefill(formId, new Date(), teamMember.name, userType, gatheringType)
          : alert("Please select a team member")}>
        Submit
      </Button>
    </div>
  );
}

export default App
