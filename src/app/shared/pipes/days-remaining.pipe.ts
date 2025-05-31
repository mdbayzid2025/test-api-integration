import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysRemaining',
  standalone: true,
})
export class DaysRemainingPipe implements PipeTransform {
  transform(deleteDateString: string): string {
    if (!deleteDateString) {
      return 'Invalid date';
    }

    // Parse the given deleteDateString and set it to midnight
    const baseDate = new Date(deleteDateString);
    baseDate.setHours(0, 0, 0, 0); // Normalize to midnight

    // Calculate the deletion date (10 days after)
    const deletionDate = new Date(baseDate);
    deletionDate.setDate(baseDate.getDate() + 10); // Add exactly 10 days

    // Get the current date normalized to midnight for accurate comparison
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Calculate the time difference in milliseconds
    const timeDifference = deletionDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const daysRemaining = Math.round(timeDifference / (1000 * 60 * 60 * 24));

    // Return the formatted output
    if (daysRemaining > 0) {
      return `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`;
    } else if (daysRemaining === 0) {
      return 'Today';
    } else {
      return 'Deleted';
    }
  }

}
