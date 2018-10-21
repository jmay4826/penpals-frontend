import * as React from "react";

interface IProps
  extends React.InputHTMLAttributes<
      HTMLInputElement | HTMLDivElement | HTMLLabelElement
    > {
  label?: string;
  inputStyle?: React.CSSProperties;
  inputClassName?: string;
  field?: any;
  error?: string;
  additionalChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IState {
  touched: boolean;
}

export class Input extends React.Component<IProps, IState> {
  public input: React.RefObject<HTMLInputElement>;
  constructor(props: IProps) {
    super(props);
    this.input = React.createRef();
    this.state = { touched: false };
  }
  public handleBlur = () => {
    this.setState({ touched: true });
  };

  public handleClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
    if (this.input.current) {
      this.input.current.focus();
    }
  };

  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.field && this.props.field.onChange) {
      this.props.field.onChange(e);
    } else if (this.props.onChange) {
      this.props.onChange(e);
    }
    if (this.props.additionalChange) {
      this.props.additionalChange(e);
    }
  };

  public render() {
    const {
      label,
      style,
      inputStyle,
      inputClassName,
      className,
      placeholder,
      field,
      form,
      children,
      error,
      additionalChange,
      onChange,
      ...props
    } = this.props;

    return (
      <div
        className={`input-component-container ${className || ""}`}
        style={style}
      >
        <input
          ref={this.input}
          className={`input-component-input ${inputClassName || ""}`}
          style={{
            ...inputStyle,
            border: this.state.touched && error ? "1px  solid red" : ""
          }}
          onBlur={this.handleBlur}
          // {...field}
          {...props}
          onChange={this.handleChange}
        />
        <label
          onClick={this.handleClick}
          className={`input-component-label ${!!this.input.current &&
            !this.input.current.value &&
            "placeholder"}`}
        >
          {label}
        </label>
        <div
          className={`input-component-error ${
            this.state.touched && error ? "" : "hidden"
          }`}
        >
          * {error}
        </div>
        <style jsx={true}>{`
          .input-component-container {
            display: flex;
            flex-direction: column;
            position: relative;
            padding: 0;
            margin: 10px;
          }

          .input-component-label {
            font-family: "Varela Round";
            transition: all 250ms;
            padding: 5px;
            position: absolute;
            color: gray;
            font-size: 0.95em;
          }

          .input-component-input:focus + .input-component-label {
            padding: 5px;
            padding-top: 5px;
            font-size: 0.95em;
          }

          .input-component-label.placeholder {
            font-size: 1.2em;
            padding: 11px;
            padding-top: 1em;
          }

          .input-component-input {
            font-family: "Varela Round";
            font-size: 1.2em;
            padding: 10px;
            margin: 10px;
            border: 1px solid #e5e9f2;
            border-radius: 6px;
            background-color: rgba(255, 255, 255, 1);
            padding-top: 1.5em;
            margin: 0;
            flex-grow: 1;
          }

          .full-width {
            width: 100%;
          }

          .input-component-error {
            margin: 5px 5px;
            transition: opacity 250ms;
          }

          .input-component-error.hidden {
            opacity: 0;
          }
        `}</style>
      </div>
    );
  }
}