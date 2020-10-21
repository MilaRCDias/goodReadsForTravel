/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import style from "./GoodRead.module.css";
import axios from "axios";
import Pagination from "@material-ui/lab/Pagination";
import { useTranslation } from "react-i18next";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import {sortDataAlphabetic} from './helpers';
import ListingBook from "../../components/ListingBook";

/**
 *  GOOD READ WIDGET
 *  Container component of Good Reads for travel
 *
 */

const GoodRead = ({ locationInput, coordinateInput }) => {
  const [loading, setLoading] = useState(false);
  const [totalSearch, setTotalSearch] = useState();
  const [displayData, setDisplayData] = useState();
  const [listDataByPage, setListDataByPage] = useState();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [selectBookSort, setSelectBookSort] = useState("");
  const itemsByPage = 5;

  const { t } = useTranslation();



  /**
   *  Update data to show on page
   *  when page are change
   *
   */
  useEffect(() => {
    if (!displayData) return;

    handlePagination(displayData, page, itemsByPage);
  }, [page, displayData]);

  /**
   *  Function to handle page change
   *  @returns filtered data array to show on page
   *
   * @param {array} data initial data array
   * @param {number} page current page
   * @param {number} items total items displayed by page
   *
   */
  const handlePagination = (data, page, items) => {
    const start = (page - 1) * items;
    const end = start + items;

    const dataSliced = data.slice(start, end);

    return setListDataByPage(dataSliced);
  };

  /**
   * Function to handle click to change page
   * Sets the page state
   * @param {*} e 
   * @param {*} value 
   */
    const handleClickPage = (e, value) => {
      setPage(value);
    };


  /**
   * Http request to get search of books
   * @param {*} location
   */
  const getBooks = (location) => {
    setLoading(true);
    const city = location[0].split(" ").join("+").toLowerCase();
    const country = location[1]
      ? location[1].split(" ").join("+").toLowerCase()
      : null;

    axios
      .get(
        `http://openlibrary.org/search.json?q=${
          country ? `${city}+${country}` : city
        }`
      )
      .then((response) => {
        setDisplayData(response.data.docs);
        setLoading(false);
        setTotalSearch(response.data.docs.length);
        setTotalPage(Math.ceil(response.data.docs.length / 5));
      })
      .catch((error) => {
        throw error;
      });
  };

  /**
   * Http request to reverse coordinates into address
   * 
   * @param {*} coordinates
   */
  const reverseGeolocation = (coordinates) => {
    axios
      .get(
        `https://us1.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_GEO_API_KEY}&lat=${coordinates[0]}&lon=${coordinates[1]}&format=json`
      )
      .then((response) => {
        getBooks([response.data.address.city, response.data.address.country]);
      })
      .catch((error) => {
        throw error;
      });
  };

/**
 * 
 */
  // TODO single source of input value
  useEffect(() => {
    if (locationInput === undefined && coordinateInput === undefined) return;

    if (locationInput) getBooks(locationInput);

    if (coordinateInput) reverseGeolocation(coordinateInput);
  }, [locationInput, coordinateInput]);


  

  /**
   * Function to handle the sorting selection
   * @param {*} e 
   */
  const onChangeBookSort = (e) => {
    let sortedData;
    setLoading(true);
    setSelectBookSort(e.target.value);
    setPage(1);

    sortedData = sortDataAlphabetic(displayData, e.target.value);
    handlePagination(sortedData, page, itemsByPage);

    setLoading(false);
  };

  return (
    <div className={style.main}>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={style.headResults}
      >
        <Grid container alignItems="center" justify="space-between">
          <Grid item className={style.flexItem3}>
            {" "}
            <h3>
              {t("result_label")} {locationInput}
              <span>{totalSearch ? `(${totalSearch})` : null}</span>
            </h3>
          </Grid>
          {/*  */}
          Sort by
          <Grid item >
            <FormControl classes={{ root: style.bookLangSelect }}>
             
            <Select
                variant="outlined"
                label="Sort by"
                id="select"
                value={selectBookSort}
                onChange={onChangeBookSort}
              >
                <MenuItem value="" disabled>Sort by</MenuItem>
                <MenuItem value="AZ">A-Z</MenuItem>
                <MenuItem value="ZA">Z-A</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <ListingBook data={listDataByPage} loading={loading} />
      <div>
        {listDataByPage ? (
          <Pagination
            count={totalPage}
            page={page}
            onChange={handleClickPage}
            className={style.pagination}
          />
        ) : null}
      </div>
    </div>
  );
};

export default GoodRead;
