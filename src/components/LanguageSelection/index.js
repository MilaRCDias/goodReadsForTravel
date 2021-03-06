import React, {useState} from 'react';
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import { useTranslation } from "react-i18next";


/**
 * Component for Language selection of the interface
 */

const LanguadeSelection = () => {
  const { t, i18n } = useTranslation();
  const [languageSelect, setLanguageSelect] = useState("en");


  const handleChangeLang = (event) => {
    setLanguageSelect(event.target.value);
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div>
      <FormControl variant="outlined" >
        <Select
          labelId="language"
          id="language"
          value={languageSelect}
          onChange={handleChangeLang}
        >
          <MenuItem value="en">{t("label_english")}</MenuItem>
          <MenuItem value="pt">{t("label_portuguese")}</MenuItem>
          <MenuItem value="fr">{t("label_french")}</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default LanguadeSelection;