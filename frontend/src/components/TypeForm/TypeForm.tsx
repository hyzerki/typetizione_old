import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./TypeForm.css";
import "../../assets/fonts/UbuntuMono-R.ttf";
import useInterval from "../../hooks/useInterval";

function TypeForm(props: any) {
    //Constants 
    const textToType: string = props.textToType;
    const textParts: Array<string> = textToType.split(" ");

    //Text states 
    const [textLeftToType, setTextLeftToType] = useState(textToType);
    const [currentPart, setCurrentPart] = useState(0);
    const [userInputText, setUserInputText] = useState("");
    const [isUserInputFocused, setIsUserInputFocused] = useState(false);
    const [commitedText, setCommitedText] = useState("");
    //Stats states
    const [startTime, setStartTime] = useState(() => Date.now());
    const [currentTime, setCurrentTime] = useState(0);
    const [resultTime, setResultTime] = useState(0);
    const [errorsAmount, setErrorsAmount] = useState(0);
    const [errorsMadePreviously, setErrorsMadePreviously] = useState(false);

    //Refs
    const userInputRef: React.LegacyRef<HTMLInputElement> = useRef(null);

    useInterval(timeRefreshTick, 100);

    useEffect(() => {
        if (props.focusOnStart) {
            userInputRef.current?.focus();
        }
    }, [])

    const createErrorMask = (input: string, word: string) => {
        let isCaretPlaced: boolean = false;
        let result: Array<JSX.Element> = [];
        let isErrorsMade: boolean = false;
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
        if (typeof props.onChange === "function")
            props.onChange();
    };

    function timeRefreshTick() {
        console.log(startTime);
        setCurrentTime(Date.now() - startTime);
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
        console.log(startTime);
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


                <div className="resultWrapper">
                    <div className="resultElement">{(currentTime / 1000).toFixed(1)}s.</div>
                    <div className="resultElement">acc. {(100 - (100 / (textToType.length / errorsAmount))).toFixed(2)}%</div>
                </div>

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
