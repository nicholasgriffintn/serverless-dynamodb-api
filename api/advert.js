'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Post a new advert
module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const jobTitle = requestBody.jobTitle;
  const originalID = requestBody.originalID;
  const jobLink = requestBody.jobLink;
  const companyLogoPath = requestBody.companyLogoPath;
  const AdvertId = requestBody.AdvertId;
  const CompanyId = requestBody.CompanyId;
  const CompanyName = requestBody.CompanyName;
  const SalaryFrom = requestBody.SalaryFrom;
  const SalaryTo = requestBody.SalaryTo;
  const SalaryPeriod = requestBody.SalaryPeriod;
  const SalaryType = requestBody.SalaryType;
  const Benefits = requestBody.Benefits;
  const JobLocation = requestBody.JobLocation;
  const Description = requestBody.Description;
  const AdvertReference = requestBody.AdvertReference;
  const PostCode = requestBody.PostCode;
  const Latitude = requestBody.Latitude;
  const Longitude = requestBody.Longitude;
  const ExpiryDate = requestBody.ExpiryDate;
  const PostingDate = requestBody.PostingDate;
  const JobCategory = requestBody.JobCategory;
  const Summary = requestBody.Summary;
  const Currency = requestBody.Currency;
  const JobType = requestBody.JobType;
  const JobTypeTime = requestBody.JobTypeTime;
  const JobDuration = requestBody.JobDuration;
  const PostingType = requestBody.PostingType;
  const SubLocation = requestBody.SubLocation;
  const JobRegion = requestBody.JobRegion;
  const Industry = requestBody.Industry;
  const Country = requestBody.Country;

  if (
    typeof jobTitle !== 'string' || 
    typeof originalID !== 'string' || 
    typeof jobLink !== 'string' || 
    typeof companyLogoPath !== 'string' || 
    typeof AdvertId !== 'string' || 
    typeof CompanyId !== 'string' || 
    typeof CompanyName !== 'string' || 
    typeof SalaryFrom !== 'string' || 
    typeof SalaryTo !== 'string' || 
    typeof SalaryPeriod !== 'string' || 
    typeof SalaryType !== 'string' || 
    typeof Benefits !== 'string' || 
    typeof JobLocation !== 'string' || 
    typeof Description !== 'string' || 
    typeof AdvertReference !== 'string' || 
    typeof PostCode !== 'string' || 
    typeof Latitude !== 'string' || 
    typeof Longitude !== 'string' || 
    typeof ExpiryDate !== 'string' || 
    typeof PostingDate !== 'string' || 
    typeof JobCategory !== 'string' || 
    typeof Summary !== 'string' || 
    typeof Currency !== 'string' || 
    typeof JobType !== 'string' || 
    typeof JobTypeTime !== 'string' || 
    typeof JobDuration !== 'string' || 
    typeof PostingType !== 'string' || 
    typeof SubLocation !== 'string' || 
    typeof JobRegion !== 'string' || 
    typeof Industry !== 'string' || 
    typeof Country !== 'string'
  ) {
    callback(new Error('Couldn\'t submit advert because of validation errors.'));
    return;
  }

  submitAdvertP(advertInfo(jobTitle, originalID, jobLink, companyLogoPath, AdvertId, CompanyId, CompanyName, SalaryFrom, SalaryTo, SalaryPeriod, SalaryType, Benefits, JobLocation, Description, AdvertReference, PostCode, Latitude, Longitude, ExpiryDate, PostingDate, JobCategory, Summary, Currency, JobType, JobTypeTime, JobDuration, PostingType, SubLocation, JobRegion, Industry, Country))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted advert with the id ${originalID}`,
          advertId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit advert with id ${originalID}`
        })
      })
    });
};


const submitAdvertP = advert => {
  console.log('Submitting advert');
  const advertInfo = {
    TableName: process.env.ADVERTS_TABLE,
    Item: advert,
  };
  return dynamoDb.put(advertInfo).promise()
    .then(res => advert);
};

const advertInfo = (jobTitle, originalID, jobLink, companyLogoPath, AdvertId, CompanyId, CompanyName, SalaryFrom, SalaryTo, SalaryPeriod, SalaryType, Benefits, JobLocation, Description, AdvertReference, PostCode, Latitude, Longitude, ExpiryDate, PostingDate, JobCategory, Summary, Currency, JobType, JobTypeTime, JobDuration, PostingType, SubLocation, JobRegion, Industry, Country) => {
  console.log('Creating advert details');
  const timestamp = new Date().getTime();
  return {
    id: originalID,
    jobTitle: jobTitle,
    jobLink: jobLink,
    companyLogoPath: companyLogoPath,
    AdvertId: AdvertId,
    CompanyId: CompanyId,
    CompanyName: CompanyName,
    SalaryFrom: SalaryFrom,
    SalaryTo: SalaryTo,
    SalaryPeriod: SalaryPeriod,
    SalaryType: SalaryType,
    Benefits: Benefits,
    JobLocation: JobLocation,
    Description: Description,
    AdvertReference: AdvertReference,
    PostCode: PostCode,
    Latitude: Latitude,
    Longitude: Longitude,
    ExpiryDate: ExpiryDate,
    PostingDate: PostingDate,
    JobCategory: JobCategory,
    Summary: Summary,
    Currency: Currency,
    JobType: JobType,
    JobTypeTime: JobTypeTime,
    JobDuration: JobDuration,
    PostingType: PostingType,
    SubLocation: SubLocation,
    JobRegion: JobRegion,
    Industry: Industry,
    Country: Country,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};

// List all adverts
module.exports.list = (event, context, callback) => {
  var params = {
      TableName: process.env.ADVERTS_TABLE,
      ProjectionExpression: "jobTitle, originalID, jobLink, companyLogoPath, AdvertId, CompanyId, CompanyName, SalaryFrom, SalaryTo, SalaryPeriod, SalaryType, Benefits, JobLocation, Description, AdvertReference, PostCode, Latitude, Longitude, ExpiryDate, PostingDate, JobCategory, Summary, Currency, JobType, JobTypeTime, JobDuration, PostingType, SubLocation, JobRegion, Industry, Country"
  };

  console.log("Scanning Adverts table.");
  const onScan = (err, data) => {

      if (err) {
          console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          callback(err);
      } else {
          console.log("Scan succeeded.");
          return callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                  adverts: data.Items
              })
          });
      }

  };

  dynamoDb.scan(params, onScan);

};

// Get an individual advert
module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.ADVERTS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch advert.'));
      return;
    });
};

// Delete an individual advert
module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.ADVERTS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.delete(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t delete advert.'));
      return;
    });
};
