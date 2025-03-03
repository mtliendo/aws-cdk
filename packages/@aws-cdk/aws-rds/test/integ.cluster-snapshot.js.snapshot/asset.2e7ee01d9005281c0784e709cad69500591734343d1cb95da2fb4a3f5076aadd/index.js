"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompleteHandler = exports.onEventHandler = void 0;
const aws_sdk_1 = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
async function onEventHandler(event) {
    console.log('Event: %j', event);
    const rds = new aws_sdk_1.RDS();
    const physicalResourceId = `${event.ResourceProperties.DBClusterIdentifier}-${event.ResourceProperties.DBClusterIdentifier}`;
    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
        const data = await rds.createDBClusterSnapshot({
            DBClusterIdentifier: event.ResourceProperties.DBClusterIdentifier,
            DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
        }).promise();
        return {
            PhysicalResourceId: physicalResourceId,
            Data: {
                DBClusterSnapshotArn: data.DBClusterSnapshot?.DBClusterSnapshotArn,
            },
        };
    }
    if (event.RequestType === 'Delete') {
        await rds.deleteDBClusterSnapshot({
            DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
        }).promise();
    }
    return {
        PhysicalResourceId: `${event.ResourceProperties.DBClusterIdentifier}-${event.ResourceProperties.DBClusterIdentifier}`,
    };
}
exports.onEventHandler = onEventHandler;
async function isCompleteHandler(event) {
    console.log('Event: %j', event);
    const snapshotStatus = await tryGetClusterSnapshotStatus(event.ResourceProperties.DBClusterSnapshotIdentifier);
    switch (event.RequestType) {
        case 'Create':
        case 'Update':
            return { IsComplete: snapshotStatus === 'available' };
        case 'Delete':
            return { IsComplete: snapshotStatus === undefined };
    }
}
exports.isCompleteHandler = isCompleteHandler;
async function tryGetClusterSnapshotStatus(identifier) {
    try {
        const rds = new aws_sdk_1.RDS();
        const data = await rds.describeDBClusterSnapshots({
            DBClusterSnapshotIdentifier: identifier,
        }).promise();
        return data.DBClusterSnapshots?.[0].Status;
    }
    catch (err) {
        if (err.code === 'DBClusterSnapshotNotFoundFault') {
            return undefined;
        }
        throw err;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxxQ0FBOEIsQ0FBQyx3REFBd0Q7QUFFaEYsS0FBSyxVQUFVLGNBQWMsQ0FBQyxLQUFxQjtJQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsRUFBRSxDQUFDO0lBRXRCLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFFN0gsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNwRSxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztZQUM3QyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CO1lBQ2pFLDJCQUEyQixFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQywyQkFBMkI7U0FDbEYsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTztZQUNMLGtCQUFrQixFQUFFLGtCQUFrQjtZQUN0QyxJQUFJLEVBQUU7Z0JBQ0osb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLG9CQUFvQjthQUNuRTtTQUNGLENBQUM7S0FDSDtJQUVELElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDbEMsTUFBTSxHQUFHLENBQUMsdUJBQXVCLENBQUM7WUFDaEMsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLDJCQUEyQjtTQUNsRixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZDtJQUVELE9BQU87UUFDTCxrQkFBa0IsRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLEVBQUU7S0FDdEgsQ0FBQztBQUNKLENBQUM7QUE3QkQsd0NBNkJDO0FBRU0sS0FBSyxVQUFVLGlCQUFpQixDQUFDLEtBQXdCO0lBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWhDLE1BQU0sY0FBYyxHQUFHLE1BQU0sMkJBQTJCLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFFL0csUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1FBQ3pCLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxRQUFRO1lBQ1gsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEtBQUssV0FBVyxFQUFFLENBQUM7UUFDeEQsS0FBSyxRQUFRO1lBQ1gsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEtBQUssU0FBUyxFQUFFLENBQUM7S0FDdkQ7QUFDSCxDQUFDO0FBWkQsOENBWUM7QUFFRCxLQUFLLFVBQVUsMkJBQTJCLENBQUMsVUFBa0I7SUFDM0QsSUFBSTtRQUNGLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsMEJBQTBCLENBQUM7WUFDaEQsMkJBQTJCLEVBQUUsVUFBVTtTQUN4QyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztLQUM1QztJQUFDLE9BQU8sR0FBUSxFQUFFO1FBQ2pCLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxnQ0FBZ0MsRUFBRTtZQUNqRCxPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELE1BQU0sR0FBRyxDQUFDO0tBQ1g7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IHR5cGUgeyBJc0NvbXBsZXRlUmVxdWVzdCwgSXNDb21wbGV0ZVJlc3BvbnNlLCBPbkV2ZW50UmVxdWVzdCwgT25FdmVudFJlc3BvbnNlIH0gZnJvbSAnQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcy9saWIvcHJvdmlkZXItZnJhbWV3b3JrL3R5cGVzJztcbmltcG9ydCB7IFJEUyB9IGZyb20gJ2F3cy1zZGsnOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25FdmVudEhhbmRsZXIoZXZlbnQ6IE9uRXZlbnRSZXF1ZXN0KTogUHJvbWlzZTxPbkV2ZW50UmVzcG9uc2U+IHtcbiAgY29uc29sZS5sb2coJ0V2ZW50OiAlaicsIGV2ZW50KTtcblxuICBjb25zdCByZHMgPSBuZXcgUkRTKCk7XG5cbiAgY29uc3QgcGh5c2ljYWxSZXNvdXJjZUlkID0gYCR7ZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXJ9LSR7ZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXJ9YDtcblxuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnIHx8IGV2ZW50LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJykge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZHMuY3JlYXRlREJDbHVzdGVyU25hcHNob3Qoe1xuICAgICAgREJDbHVzdGVySWRlbnRpZmllcjogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXIsXG4gICAgICBEQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXI6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXIsXG4gICAgfSkucHJvbWlzZSgpO1xuICAgIHJldHVybiB7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgREJDbHVzdGVyU25hcHNob3RBcm46IGRhdGEuREJDbHVzdGVyU25hcHNob3Q/LkRCQ2x1c3RlclNuYXBzaG90QXJuLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJykge1xuICAgIGF3YWl0IHJkcy5kZWxldGVEQkNsdXN0ZXJTbmFwc2hvdCh7XG4gICAgICBEQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXI6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXIsXG4gICAgfSkucHJvbWlzZSgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGAke2V2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyfS0ke2V2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyfWAsXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0NvbXBsZXRlSGFuZGxlcihldmVudDogSXNDb21wbGV0ZVJlcXVlc3QpOiBQcm9taXNlPElzQ29tcGxldGVSZXNwb25zZT4ge1xuICBjb25zb2xlLmxvZygnRXZlbnQ6ICVqJywgZXZlbnQpO1xuXG4gIGNvbnN0IHNuYXBzaG90U3RhdHVzID0gYXdhaXQgdHJ5R2V0Q2x1c3RlclNuYXBzaG90U3RhdHVzKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXIpO1xuXG4gIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICBjYXNlICdDcmVhdGUnOlxuICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiBzbmFwc2hvdFN0YXR1cyA9PT0gJ2F2YWlsYWJsZScgfTtcbiAgICBjYXNlICdEZWxldGUnOlxuICAgICAgcmV0dXJuIHsgSXNDb21wbGV0ZTogc25hcHNob3RTdGF0dXMgPT09IHVuZGVmaW5lZCB9O1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRyeUdldENsdXN0ZXJTbmFwc2hvdFN0YXR1cyhpZGVudGlmaWVyOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJkcyA9IG5ldyBSRFMoKTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmRzLmRlc2NyaWJlREJDbHVzdGVyU25hcHNob3RzKHtcbiAgICAgIERCQ2x1c3RlclNuYXBzaG90SWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICB9KS5wcm9taXNlKCk7XG4gICAgcmV0dXJuIGRhdGEuREJDbHVzdGVyU25hcHNob3RzPy5bMF0uU3RhdHVzO1xuICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgIGlmIChlcnIuY29kZSA9PT0gJ0RCQ2x1c3RlclNuYXBzaG90Tm90Rm91bmRGYXVsdCcpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRocm93IGVycjtcbiAgfVxufVxuIl19