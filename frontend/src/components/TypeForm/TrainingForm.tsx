import { Fragment, useEffect, useState } from "react";
import TypeForm from "./TypeForm";
import { currentPlayerState } from "../../state/currentPlayerState";
import { useRecoilValue } from "recoil";
import TextService from "../../service/textService";
import useInterval from "../../hooks/useInterval";


function TrainingForm() {
    const [textToType, setTextToType] = useState<string | null>(null);
    const [autofocus, setAutofocus] = useState(false);

    //stats states
    const [startTime, setStartTime] = useState(() => Date.now());
    const [currentTime, setCurrentTime] = useState(0);
    const [resultTime, setResultTime] = useState(0);
    const [errorsAmount, setErrorsAmount] = useState(0);
    const [enteredTextLength, setEnteredTextLength] = useState(0);
    const [isUserInputFocused, setIsUserInputFocused] = useState(false);

    const [accuracy, setAccuracy] = useState<number>(100);
    const [charsPerMin, setCharsPerMinute] = useState<number>(0);


    useInterval(timeRefreshTick, 100)

    useEffect(() => {
        TextService.getRandomText().then(text => { setTextToType(text); });
    }, [])

    function timeRefreshTick() {
        if (isUserInputFocused) {
            console.log(startTime);
            setCurrentTime(Date.now() - startTime);
        }
    }

    function setTypingStats(stats: any) {
        let textLength: number | undefined = textToType?.length;
        setCharsPerMinute(((stats.commitedText.length) / currentTime) * 60);
        setAccuracy(+((!!textLength ? textLength : 0 / stats.errorsAmount) * 100).toFixed(2));
    }

    function onTextComplete() {
        setTextToType(null);
        setAutofocus(true);
        TextService.getRandomText().then(text => { setTextToType(text); });
    }

    function onFocus() {
        setIsUserInputFocused(true);
        setStartTime(Date.now());
    }

    function onBlur() {
        setIsUserInputFocused(false);
    }



    return (
        <Fragment>
            <div className={`flex flex-col  place-items-center justify-center h-full typeForm ${isUserInputFocused ? null : "blur"}`}>
                <div className="resultWrapper text-[30px]" style={{ color: "#888888" }}>
                    <div className="resultElement">cpm. {charsPerMin}</div>
                    <div className="resultElement">acc. {accuracy}%</div>
                    <div className="resultElement">{(currentTime / 1000).toFixed(1)}s.</div>
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
                            setTypingStats={setTypingStats}
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