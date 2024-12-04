import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLeaveStore } from '@/store/leaveStore';
import { useAuth } from '@/hooks/useAuth';
import { Calendar as CalendarIcon } from "lucide-react";
import { createCalendarEvent } from '@/services/calendarService';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

export const LeaveRequestForm = () => {
    const { account, getToken } = useAuth();
    const addRequest = useLeaveStore((state) => state.addRequest);

    // Leave Type and Notes State
    const [type, setType] = useState<'vacation' | 'sick' | 'personal'>('vacation');
    const [notes, setNotes] = useState('');

    // Date Range State
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { from: startDate, to: endDate } = date || {};

        if (!startDate || !endDate || !account) return;

        const {accessToken} = await getToken();
        if (!accessToken) {
            console.error('Access token not available');
            return;
        };

        addRequest({
            userId: account.localAccountId,
            startDate,
            endDate,
            type,
            notes,
        });

        await createCalendarEvent({
            startDate,
            endDate,
            type,
            notes,
            accessToken,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Range Picker */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Select leave dates</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            {/* Leave Type Selector */}
            <Select onValueChange={(s: 'vacation' | 'sick' | 'personal') => setType(s)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal Leave</SelectItem>
                </SelectContent>
            </Select>

            {/* Notes Textarea */}
            <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                className="h-24"
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
                Submit Request
            </Button>
        </form>
    );
};
