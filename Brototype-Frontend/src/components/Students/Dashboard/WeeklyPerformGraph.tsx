import React, { useEffect, useState } from "react";
import ReactApexChart from 'react-apexcharts';
import ReactGA from 'react-ga';
import mixpanel from 'mixpanel-browser';
import { getWeeklyPerformance } from "../../../utils/methods/get";

mixpanel.init("0cd6a51299618727d669eb86cb89d77d", {
  debug: true
});

const WeeklyPerformGraph = () => {
  const [selectWeek, setSelectWeek] = useState("1-7");
  const [reviewPerformance, setReviewPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectWeek]);

  const fetchData = async () => {
    const batchId = "657aa5093476c843c28a377d";
    const studentId = "657aaa012a15acfff364bb5a";
    const data = {
      batchId,
      studentId,
      selectWeek
    };

    try {
      setLoading(true);
      const response = await getWeeklyPerformance(data);
      console.log(response.response.data, "weekly perform data comingggggg");
      setReviewPerformance(response.response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weekly performance:', error);
    }
  };

  const trackWeekSelection = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selectedWeek: string) => {
    e.preventDefault()
    console.log("set up the analytics", selectedWeek);

    ReactGA.event({
      category: 'Weekly Performance Graph',
      action: 'Week Selected',
      label: selectedWeek,
      value: 1
    });

    mixpanel.identify("6556547a336082588cdaa57f");
    mixpanel.track("weeklyPerformanceGraph", { page: 'Weekly-Graph' });
    mixpanel.people.set({
      $first_name: "muhammed",
      $last_name: "rashid",
      $email: "muhammedrashi59@gmail.com"
    });
  };

  const weekOptions = [
    { label: "week1", value: "1-7" },
    { label: "week2", value: "8-14" },
    { label: "week3", value: "15-21" }
    // Add more week options as needed
  ];

  const weekChartOptions = {
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          zoom: '',
          zoomin: false,
          zoomout: false,
          download: true,
          selection: false,
          pan: false,
          reset: '',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      type: 'category',
      categories: ['week 1', 'week 2', 'week 3', 'week 4', 'week 5', 'week 6', 'week 7'],
    },
    yaxis: {
      min: 0,
      max: 30,
      tickAmount: 4,
      labels: {
        formatter: (value: number) => {
          return value.toFixed(0);
        },
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    colors: ['#6E59A3', '#F1BB67'],
  };

  return (
    <>
      <div className="w-46rem mt-14 h-22rem bg-white ml-5 rounded-xl shadow-xl border border-gray-300 hover hover:border-2 border-gray-300">
        <div className="flex">
          <h1 className="text-md ml-5 font-roboto font-semibold mt-5">Performance</h1>
          <div className="relative group ml-33rem mt-3">
            <button
              className="border border-gray-350 text-black px-2 py-2 rounded flex items-center top-3 right-3 text-sm font-roboto font-semibold"
            >
              Weekly
              <svg
                className="ml-2 w-4 h-4 fill-current text-gray-600 mt-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 12l-5-5 1.5-1.5L10 9l3.5-3.5L16 7z" />
              </svg>
            </button>

            <div className="absolute hidden bg-white shadow-md rounded-md group-hover:block z-10">
              {weekOptions.map((option) => (
                <a
                  key={option.value}
                  href=""
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 "
                  onClick={(e) => {
                    setSelectWeek(option.value);
                    trackWeekSelection(e, option.label);
                  }}
                >
                  {option.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ReactApexChart
              options={weekChartOptions}
              series={[
                { name: 'ReviewPerformance', data: reviewPerformance.map((element: { reviewScore: any; }) => element.reviewScore) },
                { name: 'TaskPerformance', data: reviewPerformance.map((element: { reviewScore: any, communicationScore: any, miscellaneousWorkouts: any, personalWorkoutsScore: any }) => element.communicationScore + element.miscellaneousWorkouts + element.personalWorkoutsScore) }
              ]}
              type="area"
              height={250}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default WeeklyPerformGraph;
