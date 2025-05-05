
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'wouter';

export default function ParentDashboard() {
  const navigate = useNavigate();
  
  const { data: children } = useQuery({
    queryKey: ['children'],
    queryFn: () => apiRequest('GET', '/api/parent/children')
  });

  const { data: progressReports } = useQuery({
    queryKey: ['progress-reports'],
    queryFn: () => apiRequest('GET', '/api/parent/progress-reports')
  });

  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => apiRequest('GET', '/api/parent/announcements')
  });

  return (
    <div className="space-y-6">
      {/* Children Overview */}
      <Card>
        <CardHeader>
          <CardTitle>My Children</CardTitle>
          <CardDescription>Monitor your children's educational progress</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {children?.map((child) => (
            <div key={child.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={child.profile_image} />
                  <AvatarFallback>{child.first_name[0]}{child.last_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{child.first_name} {child.last_name}</h3>
                  <p className="text-sm text-muted-foreground">{child.grade_level}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate(`/student/${child.id}`)}>
                View Details
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Progress Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Reports</CardTitle>
          <CardDescription>Latest academic performance</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {progressReports?.map((report) => (
            <div key={report.child_id} className="space-y-4">
              <h3 className="font-medium">{report.name}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Average Grade</p>
                  <p className="text-lg font-medium">{report.average_grade}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <p className="text-lg font-medium">{report.attendance}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Behavior</p>
                  <p className="text-lg font-medium">{report.behavior}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>School Announcements</CardTitle>
          <CardDescription>Important updates from the school</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements?.map((announcement) => (
            <div key={announcement.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                </div>
                {announcement.is_pinned && (
                  <Badge variant="secondary">Pinned</Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
