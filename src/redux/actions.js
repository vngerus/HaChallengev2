import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchSales = () => async (dispatch) => {
  dispatch({ type: "FETCH_SALES_REQUEST" });

  try {
    const salesCollection = collection(db, "sales");
    const salesSnapshot = await getDocs(salesCollection);
    const salesData = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    dispatch({ type: "FETCH_SALES_SUCCESS", payload: salesData });
  } catch (error) {
    dispatch({ type: "FETCH_SALES_FAILURE", error });
  }
};