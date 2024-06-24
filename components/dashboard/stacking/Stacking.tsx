import React from "react";
import StackingStepsHeader from "./StackingStepsHeader";
import StackStepOneBody from "./StackStepOneBody";
import SignLoadingModal from "../SignLoadingModal";
import StackStepTwoBody from "./StackStepTwoBody";
import StackingLoadingModal from "../StackingLoadingModal";
import StackStepThreeBody from "./StackStepThreeBody";

const Stacking: React.FC = () => {
  const [steps, setSteps] = React.useState([
    {
      number: "1",
      title: "Stake your token : Informations",
      text: "Staking Informations",
      isActive: true,
    },
    { number: "2", title: "Send funds", text: "Send funds", isActive: false },
    {
      number: "3",
      title: "You staked sucessfully",
      text: "Confirmation",
      isActive: false,
    },
  ]);
  const [showSignModal, setShowSignModal] = React.useState(false);
  const [showStackingModal, setShowStackingModal] = React.useState(false);

  React.useEffect(() => {
    const step2 = steps.find((step) => step.number == "2");
    const step3 = steps.find((step) => step.number == "3");
    if (step2 && step2.isActive) {
      setShowSignModal(true);
      console.log("showSignModal", showSignModal);
      setTimeout(() => {
        setShowSignModal(false);
        console.log("showSignModal", showSignModal);
      }, 5000);
    }

    if (step3 && step3.isActive) {
      setShowStackingModal(true);
      console.log("showStackingModal", showStackingModal);
      setTimeout(() => {
        setShowStackingModal(false);
        console.log("showStackingModal", showStackingModal);
      }, 5000);
    }
  }, [steps]);

  const infoCards = [
    {
      title: "Current APY",
      description: "Lorem ipsum dolor sit amet coetur.",
      value: "xx",
    },
    {
      title: "Program duration",
      description: "Lorem ipsum dolor sit amet coetur.",
      value: "xx",
    },

    {
      title: "Start date",
      description: "Lorem ipsum dolor sit amet coetur.",
      value: "xx",
    },
    {
      title: "End date",
      description: "Lorem ipsum dolor sit amet coetur.",
      value: "xx",
    },
  ];

  return (
    <div className=" relative flex pb-20 pt-20 bg-neutral-50 flex-col px-20 max-md:px-5">
      <StackingStepsHeader steps={steps} />
      {showSignModal && <SignLoadingModal />}
      {steps[0].isActive && (
        <StackStepOneBody infoCards={infoCards} setSteps={setSteps} />
      )}
      {showStackingModal && <StackingLoadingModal />}
      {steps[1].isActive && showSignModal == false && (
        <StackStepTwoBody setSteps={setSteps} />
      )}

      {steps[2].isActive && showStackingModal == false && (
        <StackStepThreeBody />
      )}
    </div>
  );
};

export default Stacking;
