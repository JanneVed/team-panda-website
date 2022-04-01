import { Client } from "@notionhq/client";
import { useState } from "react";
import Head from "next/head";

import "react-datepicker/dist/react-datepicker.css";
import styles from '../styles/Home.module.css';

const HomePage = (props) => {

  console.log(props.data[0])

// #region Get information from notion database
  // Get every Employee.
  const getEmployeeInfo = () => {
    const employees = [];
    props.data[1].forEach(employee => {
      employees.push({
        id: employee.id,
        employee: employee.properties.Name.title[0].plain_text,
        role: employee.properties.Role.rich_text[0].plain_text,
        total_hours: employee.properties['Total hours'].rollup.number});
    });
    return employees
  };

  // Get every Project.
  const getProjectsInfo = () => {
    const projects = [];
    props.data[0].forEach(project => {
      projects.push({
        id: project.id,
        projectName: project.properties.Projectname.title[0].plain_text,
        projectHours: project.properties.Hours.number,
        projectProgress: project.properties["Worked hours"].rollup.number,
        projectHoursLeft: project.properties["Hours left"].formula.number,
        status: project.properties.Status.select.name,
      });
    });
    return projects;
  };

  // Get every Timereport.
  const getTimereportsInfo = () => {
    const reports = [];
    props.data[2].forEach(report => {
      reports.push({
        id: report.id,
        date: report.properties.Date.date.start,
        hours: report.properties.Hours.number,
        note: report.properties.Note.title[0].plain_text,
        person: report.properties.Person.relation[0].id,
        project: report.properties.Project.relation[0].id,
      })
    })
    return reports;
  }
// #endregion

// #region Drop Downs
  // Creates Employee names in the employee select.
  const dropdownNames = () => {
    const employees = [];
    getEmployeeInfo().forEach(element => {
      employees.push(<option value={element.id} key={element.id}>{element.employee} ({element.role})</option>)
    });
    return employees;
  };
  // Creates Project names in the project select.
  const dropdownProjects = () => {
    const projects = [];
    getProjectsInfo().forEach(element => {
      projects.push(<option value={element.id} key={element.id}>{element.projectName}</option>)
    });
    return projects;
  };

  const dropdownStatus = () => {
    const projects = [];
    getProjectsInfo().forEach(element => {
      projects.push(<option value={element.status} key={element.id}>{element.status}</option>)
    });
    return projects;
  };
// #endregion

// #region Page display functions
  const getEmployeeReports = (status) => {
    let reportArray = [];
    getTimereportsInfo().forEach(report => {
      if (PeopleId === report.person) {
        getProjectsInfo().forEach(project => {
          if (project.status === status) {
            if (project.id === report.project) {
              reportArray.push(
              <div className={styles.projectCard}>
                <h3>{project.projectName}</h3>
                <p>Report date: {report.date}</p>
                <p>Reported hours: {report.hours}</p>
                <p>Reporter&apos;s note: {report.note}</p>
              </div>);
            };
          };
        });
      };
    });
    return reportArray;
  };

  const reportsBetweenDates = (reportId) => {
    var employeeTotalHours = 0;
    getTimereportsInfo().forEach(report => {
      reportId.forEach(dateId => {
        if (report.id === dateId && report.person === SelectedEmployeeId) {
            employeeTotalHours += report.hours;
        };
      });
    });
    return <h3>Total Hours Worked: {employeeTotalHours}</h3>;
  };

  const projectHoursHoursLeft = () => {
    let projects = [];
    getProjectsInfo().forEach(project => {
      projects.push(
        <div className={styles.projectCard}>
          <h3>{project.projectName}:</h3>
          <p>Hours worked {project.projectProgress} of {project.projectHours}. Hours left {project.projectHoursLeft}</p>
        </div>
      );
    });
    return projects;
  };

  const displayPage = (role) => {
      if (role === "Employee") {
        return <>
          <div className={styles.reporting}>
            <form onSubmit={submitForm}>
              <label htmlFor="date-selecter">Date for Report: </label>
              <br/>
              <input
                type="date"
                name="date-selecter"
                value={ReportDate}
                onChange={e => setReportDate(e.target.value)}
                required/>
              <br/>
              <label htmlFor="hours">Hours Worked: </label>
              <br/>
              <input
                type="number"
                name="hours"
                value={WorkedHours}
                onChange={e => setWorkedHours(Number(e.target.value))}
                required/>
              <br/>
              <label htmlFor="projects">Projects: </label>
              <br/>
              <select name="projects" value={ProjectId} onChange={e => setProjectId(e.target.value)}>
                <option disabled selected>Select Project</option>
                {dropdownProjects()}
              </select>
              <br/>
              <label htmlFor="notes">Notes: </label>
              <br/>
              <input
                type="text"
                name="notes"
                value={Notes}
                onChange={(e) => setNotes(e.target.value)}
                required/>
              <br/>
              <br/>
              <button type="submit">Submit Report</button>
            </form>
          </div>

          <div className={styles.showReports}>
            <form>
              <label htmlFor="project-status">View Project With Status Of: </label>
              <br/>
              <select name="project-status" value={ProjectStatus} onChange={e => setProjectStatus(e.target.value)}>
                <option disabled selected>Select project status</option>
                {dropdownStatus()}
              </select>
            </form>
            {getEmployeeReports(ProjectStatus)}
          </div>
        </>
      };
      if (role === "Boss") {
        return <div>
          <div>
            <form>
              <br/>
              <label htmlFor="startdate">Start Date: </label>
              <br/>
              <input
                name="startdate"
                type="date"
                value={StartDate}
                onChange={e => setStartDate(e.target.value)}
              />
              <br/>
              <label htmlFor="enddate">End Date: </label>
              <br/>
              <input
                name="EndDate"
                type="date"
                value={EndDate}
                onChange={e => setEndDate(e.target.value)}
              />
              <br/>
              <label htmlFor="employeesTotHours">Employee: </label>
              <br/>
              <select name="employeesTotHours" value={SelectedEmployeeId} onChange={e => setSelectedEmployeeId(e.target.value)}>
                <option disabled selected>Select Employee</option>
                {dropdownNames()}
              </select>
            </form>
            {reportsBetweenDates(checkBetweenDates())}
          </div>
        </div>
      };
      if (role === "Project Leader") {
        return <div>
          <h3>Projects Hours:</h3>
          {projectHoursHoursLeft()}
        </div>
      };
  };
// #endregion

// #region Logics
  const getEmployeeRole = (person) => {
    let currentEmployee;
    getEmployeeInfo().forEach(employee => {
      if (person === employee.id) {
        currentEmployee = employee.role;
      };
    });
    return currentEmployee;
  };

  const checkBetweenDates = () => {
    let start;
    let end;
    let check;
    let results = [];
    let useStartDate = StartDate.toString();
    let useEndDate = EndDate.toString();
    start = useStartDate.split("-");
    end = useEndDate.split("-");

    let startDate = new Date(start[0], parseInt(start[1])-1, start[2]);
    let endDate = new Date(end[0], parseInt(end[1])-1, end[2]);

    getTimereportsInfo().forEach(report => {
      check = report.date.split("-");
      let checkDate = new Date(check[0], parseInt(check[1])-1, check[2]);
      if (checkDate >= startDate && checkDate <= endDate) {
        results.push(report.id)
      };
      check = [];
    });
    return results;
  };
// #endregion

// #region Old Stuff
  // Show total hours for selected employee
  // const getEmloyeeHours = (selected) => {
  //   let totalHours;
  //   getEmployeeInfo().forEach(element => {
  //     if (selected === element.id) {
  //       totalHours = element.total_hours
  //     }
  //   });
  //   return totalHours;
  // };

  // Calls getEmployeeInfo, compares selected person in dropdown and gets employee name
  // const getEmployeeName = (Id) => {
  //   let employeeName;
  //   getEmployeeInfo().forEach(element => {
  //     if (Id === element.id) {
  //       employeeName = element.employee
  //     }
  //   })
  //   return employeeName;
  // };

  // const getProjectName = (Id) => {
  //   let projectsName;
  //   getProjectsInfo().forEach(element => {
  //     if (Id === element.id) {
  //       projectsName = element.projectName
  //     }
  //   });
  //   return projectsName;
  // };

  // const getEmployeeProjectsStatus = (status) => {
  //   const projects = [];
  //   getProjectsInfo().forEach(project => {
  //     if (project.status === status) {
  //       projects.push(<p>{project.projectName}</p>)
  //     };
  //   })
  //   return projects;
  // }

  // getTimereportsInfo().forEach(report => {
  //   dates.forEach(date => {
  //     if (report.date === date) {
  //       getProjectsInfo().forEach(project => {
  //         if (report.project === project.id) {
  //           getEmployeeInfo().forEach(employee => {
  //             if (report.person === employee.id) {
  //               content.push(
  //                 <div>
  //                   <h3>{project.projectName}</h3>
  //                   <h4>{employee.employee}</h4>
  //                   <p>Report date: {report.date}</p>
  //                   <p>Reported hours: {report.hours}</p>
  //                   <p>Reporter&apos;s note: {report.note}</p>
  //                 </div>
  //               );
  //             };
  //           });
  //         };
  //       });
  //     };
  //   });
  // });
  //return content;
// #endregion

// #region Submit Forms
  // Submits report to notion.
  const submitForm = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:${location.port}/api/sending`, {
      method: "POST",
      body: JSON.stringify({PeopleId, ProjectId, ReportDate, WorkedHours, Notes}),
    });
    if (response.status === 201) {
      alert("Sent successfully!")
    } else {
      alert("Send failed! Check the terminal window for more information")
    }
  }
// #endregion

// #region UseStates
  const [PeopleId, setPeopleId] = useState("Select Employee");
  const [ProjectId, setProjectId] = useState("Select Project");
  const [ReportDate, setReportDate] = useState(new Date());
  const [WorkedHours, setWorkedHours] = useState(null);
  const [Notes, setNotes] = useState("");
  const [ProjectStatus, setProjectStatus] = useState("Select project status");
  const [StartDate, setStartDate] = useState(new Date());
  const [EndDate, setEndDate] = useState(new Date());
  const [SelectedEmployeeId, setSelectedEmployeeId] = useState("Select Employee")
// #endregion

// #region Main Page Render
  return <div className={styles.content}>
    <Head>
        <title>Nexus Time Reports</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </Head>
    <main>
      <div className={styles.homePageHeader}>
        <h1>Nexus</h1>
        <p className={styles.meaning}>Nexus - A means of connection between members of a group or things in a series.</p>
        <h2>Time reports</h2>
      </div>

      <div className={styles.homePageContent}>
        <div className={styles.selectEmployee}> 
          <form>
            <label htmlFor="login">Login: </label>
            <br/>
            <select name="login" value={PeopleId} onChange={e => setPeopleId(e.target.value)}>
              <option disabled selected>Select Employee</option>
              {dropdownNames()}
            </select>
          </form>
        </div>
        {displayPage(getEmployeeRole(PeopleId))}
      </div>
    </main>
    <footer className={styles.footer}>Created by: Team Panda</footer>
  </div>;
// #endregion
};

export default HomePage;

// #region Getting from notion API
  export async function getStaticProps()
  {
    let data = [];
    const notionClient = new Client(
      {
        auth: process.env.NOTION_TOKEN,
      }
    );
    
    data.push(await getProjects(notionClient));

    data.push(await getPeople(notionClient));

    data.push(await getTimereports(notionClient));

    return {
      props: {
        data,
      },
    };
  };
  // Get Projects
  async function getProjects(client)
  {
    let response = await client.databases.query(
      {
        database_id: process.env.NOTION_DATABASE_PROJECTS_ID,
      }
    );

    console.log(response.results);

    return response.results;
  };
  // Get People
  async function getPeople(client)
  {
    let response = await client.databases.query(
      {
        database_id: process.env.NOTION_DATABASE_PEOPLE_ID,
      }
    );

    console.log(response.results);

    return response.results;
  }
  // Get Timereports
  async function getTimereports(client)
  {
    let response = await client.databases.query(
      {
        database_id: process.env.NOTION_DATABASE_TIMEREPORTS_ID,
      }
    );
    console.log(response.results);

    return response.results;
  }
// #endregion