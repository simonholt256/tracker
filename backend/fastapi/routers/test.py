def evaluate_challenges(db: Session, current_user: User, habit_id: int):

    challenges = db.query(Challenge).filter(
        Challenge.user_id == current_user.id,
        Challenge.intention_id == habit_id,
        Challenge.status == "active"
    ).all()

    for challenge in challenges:

        start = challenge.start_date.date()
        end = challenge.end_date.date()

        total_days = (end - start).days + 1
        periods_count = (total_days + challenge.period_days - 1) // challenge.period_days

        # 🔹 Fetch all stars for the entire challenge once
        stars = db.query(Star).filter(
            Star.user_id == current_user.id,
            Star.habit_id == challenge.intention_id,
            func.date(Star.date_checked) >= start,
            func.date(Star.date_checked) <= end
        ).all()

        # Convert star dates into a simple list
        star_dates = [s.date_checked.date() for s in stars]

        completed_periods = 0

        for i in range(periods_count):

            period_start = start + timedelta(days=i * challenge.period_days)
            period_end = min(period_start + timedelta(days=challenge.period_days - 1), end)

            actual_period_days = (period_end - period_start).days + 1

            adjusted_target = ceil(
                challenge.target_count * (actual_period_days / challenge.period_days)
            )

            # 🔹 Count stars in this period (no DB query now)
            stars_done = sum(
                1 for d in star_dates
                if period_start <= d <= period_end
            )

            if stars_done >= adjusted_target:
                completed_periods += 1

        challenge.status = "completed" if completed_periods == periods_count else "active"

    db.commit()