import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { errorSelector } from "recoil";
import "../../assets/fonts/UbuntuMono-R.ttf";
import useInterval from "../../hooks/useInterval";
import "./TypeForm.css";

export interface textCompleteParam {
    accuracy: string;
    time: number
}

export interface statChangedParam {
    accuracy: number;
    currentTime: number;
    cpm: number;

}

interface TypeFormProps {
    textToType?: string;
    focusOnStart?: boolean;
    fontSize?: string;
    onStatsChanged?(stats: statChangedParam): void;
    onChange?(): void;
    onWordCommited?(): void;
    onTextComplete?(complete: textCompleteParam): void;
    onClick?(): void;
    onFocus?(): void;
    onBlur?(): void;
}

function TypeForm(props: TypeFormProps) {
    //todo Сделать возможность вернуться назад
    //todo Учёт времени, статистики и тд внутри компонента и поднятие этих данных наверх

    //Constants 
    const textToType: string = props.textToType!;
    const textParts: Array<string> = textToType.split(" ");

    //Text states 
    const [textLeftToType, setTextLeftToType] = useState(textToType);
    const [currentPart, setCurrentPart] = useState<number>(0);
    const [userInputText, setUserInputText] = useState("");
    const [isUserInputFocused, setIsUserInputFocused] = useState(false);
    const [commitedText, setCommitedText] = useState("");

    //Stats states
    const [startTime, setStartTime] = useState(() => Date.now());
    const [currentTime, setCurrentTime] = useState(0);
    const [resultTime, setResultTime] = useState(0);
    const [errorsAmount, setErrorsAmount] = useState(0);
    const [errorsMadePreviously, setErrorsMadePreviously] = useState(false);
    const [correctInputCount, setCorrectInputCount] = useState<number>(0);

    const [accuracy, setAccuracy] = useState<number>(100.00);
    const [cpm, setCpm] = useState<number>(0);

    //Refs
    const userInputRef: React.LegacyRef<HTMLInputElement> = useRef(null);

    useInterval(timeRefreshTick, 100);

    useEffect(() => {
        if (props.focusOnStart) {
            userInputRef.current?.focus();
        }
    }, [])

    //Для поднятия состояния наверх
    useEffect(() => {
        if (typeof props.onStatsChanged === "function")
            props.onStatsChanged({
                accuracy:100 - (100 / (textToType.length / errorsAmount)),
                cpm: ((commitedText.length + correctInputCount) * 60) / (currentTime / 1000),
                currentTime: currentTime/1000
            });
        //todo из state перенести просто в параметры onStatsChanged()
        // setCpm(((commitedText.length + correctInputCount) * 60) / (currentTime / 1000));
        // setAccuracy(100 - (100 / (textToType.length / errorsAmount)));
    }, [commitedText, errorsAmount, currentTime, correctInputCount])

    function countCorrectChars(str1: String, str2: String) {
        let iterations: number = str1.length <= str2.length ? str1.length : str2.length;
        let i: number = 0;
        for (i; i < iterations; i++) {
            if (str1[i] !== str2[i])
                break;
        }
        return i;
    }

    const createErrorMask = (input: string, word: string) => {
        let isCaretPlaced: boolean = false;
        let result: Array<JSX.Element> = [];
        let isErrorsMade: boolean = false;
        let correctInput = 0;

        for (let i = 0; ; i++) {
            if (input[i] === undefined && !isCaretPlaced) {
                result.push(
                    <div key={"caret"} className="caretWrapper">
                        <div
                            className={`caret ${isUserInputFocused ? "caretFlash" : "hidden"}`}
                        ></div>
                    </div>
                );
                isCaretPlaced = true;
            }
            if (input[i] === word[i]) {
                result.push(<span key={i} style={{ color: "#ffffff" }}>{input[i]}</span>);
                correctInput++;
            }
            else if (input[i] === undefined && word[i] !== undefined) {
                result.push(<span key={i} style={{ color: "#888888" }}>{word[i]}</span>);
            }
            else {
                result.push(<span key={i} style={{ color: "red" }}>{input[i]}</span>);
                isErrorsMade = true;
            }
            if (input[i] === undefined && word[i] === undefined) {
                break;
            }
        }
        if (isErrorsMade !== errorsMadePreviously) {
            setErrorsMadePreviously(isErrorsMade);
            if (isErrorsMade) {
                setErrorsAmount(errors => errors + 1);
            }
        }
        return result;
    }

    const onUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInputText(event.target.value);
        setCorrectInputCount(countCorrectChars(event.target.value, textParts[currentPart]));
        if (typeof props.onChange === "function")
            props.onChange();
    };

    function timeRefreshTick() {
        if (isUserInputFocused) {
            setCurrentTime(Date.now() - startTime);
        }
    }

    const onUserInputKeyPress = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.code === "Space") {
            event.preventDefault();
            if (textParts[currentPart] !== userInputText) {
                return;
            }
            setCommitedText(prevCommited => prevCommited + userInputText + " ");
            setCurrentPart(prevPart => prevPart + 1);
            setTextLeftToType(
                textToType.replace(commitedText + userInputText + " ", "")
            );
            setUserInputText("");
            setCorrectInputCount(0);
            if (typeof props.onWordCommited === "function")
                props.onWordCommited();
            if (textParts[currentPart + 1] === undefined) {
                onTextComplete();
            }
        }
    };

    const onTextComplete = () => {
        if (typeof props.onTextComplete === "function") {
            props.onTextComplete({
                accuracy: (100 - (100 / (textToType.length / errorsAmount))).toFixed(2),
                time: (Date.now() - startTime) / 1000
            });
        }
        setResultTime((Date.now() - startTime) / 1000);
    }

    const onClick = () => {
        userInputRef.current?.focus();
        if (typeof props.onClick === 'function') {
            props.onClick();
        }
        setStartTime(() => Date.now());
    };

    const onUserInputFocus = () => {
        setIsUserInputFocused(true);
        if (typeof props.onFocus === 'function') {
            props.onFocus();
        }
    };

    const onUserInputBlur = () => {
        setIsUserInputFocused(false);
        if (typeof props.onBlur === 'function') {
            props.onBlur();
        }
    };

    return (
        <React.Fragment>
            <div style={{ fontSize: props.fontSize, color: "#888888" }} className={`flex flex-col  place-items-center justify-center h-full typeForm ${isUserInputFocused ? "" : "blur"} leading-none`} onClick={onClick}>
                <div className="overflow-hidden">
                    <div>
                        <input
                            type="text"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck="false"
                            className="typeFormHiddenInput"
                            value={userInputText}
                            onChange={onUserInputChange}
                            onKeyPress={onUserInputKeyPress}
                            onFocus={onUserInputFocus}
                            onBlur={onUserInputBlur}
                            ref={userInputRef}
                        />
                    </div>
                    <div className="break-words">
                        <span style={{ color: "#ffffff" }}>{commitedText}</span>
                        {createErrorMask(userInputText, textParts[currentPart])}
                        {textLeftToType.replace(textParts[currentPart], "")}
                    </div>
                </div>

            </div>
        </React.Fragment>
    );
}

TypeForm.defaultProps = {
    textToType: "The quick brown fox jumps over the lazy dog",
    textHeight: "30px",
    focusOnStart: false,
}




export default TypeForm;

