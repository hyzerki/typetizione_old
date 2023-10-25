import { Fragment, useEffect, useState } from "react";
import TypeForm, { statChangedParam } from "./TypeForm";
import { currentPlayerState } from "../../state/currentPlayerState";
import { useRecoilValue } from "recoil";
import TextService from "../../service/textService";
import useInterval from "../../hooks/useInterval";


function TrainingForm() {
    const [textToType, setTextToType] = useState<string | null>(null);
    const [autofocus, setAutofocus] = useState(false);

    //stats states
    const [resultTime, setResultTime] = useState(0);
    const [errorsAmount, setErrorsAmount] = useState(0);
    const [enteredTextLength, setEnteredTextLength] = useState(0);
    const [isUserInputFocused, setIsUserInputFocused] = useState(false);

    const [accuracy, setAccuracy] = useState<number>(100);
    const [charsPerMin, setCharsPerMinute] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState(0);



    useEffect(() => {
        TextService.getRandomText().then(text => { setTextToType(text); });
    }, [])


    function setTypingStats(stats: statChangedParam) {
        setCurrentTime(stats.currentTime);
        setAccuracy(stats.accuracy);
        setCharsPerMinute(stats.cpm);
    }

    function onTextComplete() {
        setTextToType(null);
        setAutofocus(true);
        TextService.getRandomText().then(text => { setTextToType(text); });
    }

    function onFocus() {
        setIsUserInputFocused(true);
    }

    function onBlur() {
        setIsUserInputFocused(false);
    }



    return (
        <Fragment>
            <div className={`flex flex-col  place-items-center justify-center h-full typeForm ${isUserInputFocused ? null : "blur"}`}>
                <div className="resultWrapper text-[30px]" style={{ color: "#888888" }}>
                    <div className="resultElement">cpm. {charsPerMin.toFixed(2)}</div>
                    <div className="resultElement">acc. {accuracy.toFixed(2)}%</div>
                    <div className="resultElement">{(currentTime).toFixed(1)}s.</div>
                </div>
                {
                    textToType ?
                        <TypeForm
                            focusOnStart={autofocus}
                            onTextComplete={onTextComplete}
                            textToType={textToType}
                            //todo fix onuserinput focus
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onStatsChanged={setTypingStats}
                            fontSize="30px" />
                        :
                        <div>
                            Getting new text...
                        </div>
                }
            </div>
        </Fragment>
    )
}

export default TrainingForm;