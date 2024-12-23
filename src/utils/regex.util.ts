class RegexUtils {
  static EMAIL_EXTRACT_REGEX = /@([\w.]+@(\w+\.)+\w{2,4})\b(?![^])/gi;

  static extractMentionedStudents(notification: string): string[] {
    if (!notification || notification.trim().length === 0) {
      return [''];
    }
    return Array.from(
      notification.match(RegexUtils.EMAIL_EXTRACT_REGEX) ?? [''],
    ).map((i) => i.slice(1));
  }
}

export default RegexUtils;
