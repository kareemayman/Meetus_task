export default function FormInput({ placeholder, type, name, value, onChange, icon }) {
  return (
    <div className="form-input">
      <div className="font-awesome-icon">
        {/* <FontAwesomeIcon icon={icon}></FontAwesomeIcon> */}
        <img src={icon} alt={name} />
      </div>
      <input
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
